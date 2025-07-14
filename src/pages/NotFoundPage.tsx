import { H1, P } from '@/shared/ui/ui/typography';
import { Button } from '@/shared/ui/ui/button';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <H1 className="text-4xl font-bold text-skyrim-gold mb-2">Page Not Found</H1>
      <P className="text-skyrim-gold/70 mb-6">Sorry, the page you are looking for does not exist or is not ready yet.</P>
      <Button variant="default" onClick={() => navigate('/')}>Return Home</Button>
    </div>
  );
} 