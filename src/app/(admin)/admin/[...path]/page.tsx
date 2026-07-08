import { redirect } from 'next/navigation';

export default function AdminCatchAll() {
  redirect('/admin');
}
