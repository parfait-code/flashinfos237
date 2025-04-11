// app/api/articles/[id]/view/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/config/firebase';

// Ajouter un cache pour limiter la fréquence des incrémentations
const THROTTLE_WINDOW = 60 * 1000; // 1 minute
const viewedArticles = new Map<string, number>();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ message: 'Invalid article ID' }, { status: 400 });
    }

    // Vérifier si l'article a été récemment incrémenté
    const now = Date.now();
    const lastIncrement = viewedArticles.get(id) || 0;
    
    if (now - lastIncrement < THROTTLE_WINDOW) {
      // Si l'article a été incrémenté récemment, ne pas l'incrémenter à nouveau
      return NextResponse.json({ 
        success: true, 
        message: 'View already counted recently'
      });
    }

    // Mettre à jour le cache
    viewedArticles.set(id, now);

    // Vérifier que l'article existe
    const articleRef = doc(db, 'articles', id);
    const articleSnap = await getDoc(articleRef);

    if (!articleSnap.exists()) {
      return NextResponse.json({ message: 'Article not found' }, { status: 404 });
    }

    // Incrémenter le compteur de vues
    await updateDoc(articleRef, {
      viewCount: increment(1)
    });

    // Nettoyer le cache périodiquement pour éviter les fuites de mémoire
    if (viewedArticles.size > 1000) {
      const oldEntries = [...viewedArticles.entries()]
        .filter(([_, timestamp]) => now - timestamp > THROTTLE_WINDOW);
      oldEntries.forEach(([key]) => viewedArticles.delete(key));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating view count:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}