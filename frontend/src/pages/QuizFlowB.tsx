import { useEffect } from 'react';
import { QuizFlow } from './QuizFlow';
import { quizConfigB } from '../config/quizConfigB';

export function QuizFlowB() {
  useEffect(() => {
    // UTM script
    const utmScript = document.createElement('script');
    utmScript.src = 'https://cdn.utmify.com.br/scripts/utms/latest.js';
    utmScript.setAttribute('data-utmify-prevent-subids', '');
    utmScript.async = true;
    utmScript.defer = true;
    document.head.appendChild(utmScript);

    // Pixel 1
    window.pixelId = '69d530303c3b6ba88b6e7178';
    const pixel1 = document.createElement('script');
    pixel1.async = true;
    pixel1.defer = true;
    pixel1.src = 'https://cdn.utmify.com.br/scripts/pixel/pixel.js';
    document.head.appendChild(pixel1);

    // Pixel 2
    window.pixelId = '69d530a5aa3bcf4239e0594a';
    const pixel2 = document.createElement('script');
    pixel2.async = true;
    pixel2.defer = true;
    pixel2.src = 'https://cdn.utmify.com.br/scripts/pixel/pixel.js';
    document.head.appendChild(pixel2);
  }, []);

  return <QuizFlow config={quizConfigB} returnPath="/b" />;
}
