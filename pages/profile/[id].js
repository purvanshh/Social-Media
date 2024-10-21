import { useRouter } from 'next/router';
import ProfileContent from '../../components/ProfileContent';

export default function ProfilePage() {
  const router = useRouter();
  const { id } = router.query;

  if (!id) {
    return <div>Loading...</div>;
  }

  return <ProfileContent userId={id} />;
}

// Disable static optimization for this page
export const getServerSideProps = async () => {
  return { props: {} };
};
