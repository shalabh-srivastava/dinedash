import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/orders');
  return null; // Or a loading spinner, but redirect is usually fast enough
}
