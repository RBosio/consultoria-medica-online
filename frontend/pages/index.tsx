import withAuth from '@/lib/withAuth'
import { Auth } from '../../shared/types';
import axios from 'axios';
import Layout from '@/components/layout';

export default function Home(props: any) {
  return (
    <Layout auth={props.auth}>
      <div className=''>
      </div>
    </Layout>
  )
}

export const getServerSideProps = withAuth(async (auth: Auth | null) => {

  const doctorsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/doctor`);
  const doctorsData = doctorsResponse.data;

  return {
    props: {
      doctors: doctorsData,
      auth
    }
  }

}, true)