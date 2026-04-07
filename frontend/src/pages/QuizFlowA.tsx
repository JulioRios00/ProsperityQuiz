import { useEffect } from 'react';
import { QuizFlow } from './QuizFlow';
import { quizConfigA } from '../config/quizConfigA';

export function QuizFlowA() {
  useEffect(() => {
    // UTM script
    const utmScript = document.createElement('script');
    utmScript.src = 'https://cdn.utmify.com.br/scripts/utms/latest.js';
    utmScript.setAttribute('data-utmify-prevent-subids', '');
    utmScript.async = true;
    utmScript.defer = true;
    document.head.appendChild(utmScript);

    // Pixel 1
    window.pixelId = '69d4f55fd0d2be68368a4ede';
    const pixel1 = document.createElement('script');
    pixel1.async = true;
    pixel1.defer = true;
    pixel1.src = 'https://cdn.utmify.com.br/scripts/pixel/pixel.js';
    document.head.appendChild(pixel1);

    // Pixel 2
    window.pixelId = '69d530814790c231cc0aeb59';
    const pixel2 = document.createElement('script');
    pixel2.async = true;
    pixel2.defer = true;
    pixel2.src = 'https://cdn.utmify.com.br/scripts/pixel/pixel.js';
    document.head.appendChild(pixel2);
  }, []);

  return <QuizFlow config={quizConfigA} returnPath="/a" />;
}
