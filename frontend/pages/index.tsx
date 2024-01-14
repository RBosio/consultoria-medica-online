import withAuth from '@/lib/withAuth'
import { Auth } from '../../shared/types';
import axios from 'axios';
import Layout from '@/components/layout';
import { useTheme } from '@mui/material';
import Doctor from '@/components/doctor';
import { robotoBold } from '@/lib/fonts';
import Divider from '@mui/material/Divider';
import Input from '@/components/input';
import { FaUserDoctor } from "react-icons/fa6";
import Button from '@/components/button';
import { IoMdSearch } from "react-icons/io";
import Slider from '@/components/slider';
import { IoStar } from "react-icons/io5";
import { IoMdTime } from "react-icons/io";

export default function Home(props: any) {

  const theme = useTheme();

  console.log(props.doctors);

  return (
    <Layout auth={props.auth}>
      <section className='h-full flex flex-col xl:flex-row'>
        <div className="bg-white shadow-xl h-20 w-full xl:min-w-64 xl:w-4/12 xl:h-full">
          <h2 className={`${robotoBold.className} text-primary text-xl text-center my-4`}>Filtrar</h2>
          <div className="px-4 w-full">
            <Divider />
            <div className="py-3 flex flex-col gap-8">
              <Input startadornment={<FaUserDoctor color={theme.palette.primary.main} />} fullWidth label="Nombre" />
              <Slider icon={<IoStar />} label='Puntuación mayor que' marks={[{ value: 0, label: "0" }, { value: 2.4, label: "2.4" }, { value: 4.8, label: "4.8" }]} defaultValue={0} step={0.1} max={4.8} aria-label="Default" valueLabelDisplay="auto" />
              <Slider icon={<IoMdTime />} label='Experiencia mayor que' marks={[{ value: 0, label: "0" }, { value: 15, label: "15" }, { value: 30, label: "30" }]} defaultValue={0} max={30} aria-label="Default" valueLabelDisplay="auto" />
              <Button size='large' startIcon={<IoMdSearch />}>Buscar</Button>
            </div>
          </div>
        </div>
        <div className="w-full p-4 sm:p-10 grow overflow-x-hidden flex flex-col gap-10">
          {props.doctors.items.map((doctor: any) => (
            <Doctor
              key={doctor.id}
              fullName={`${doctor.user.name} ${doctor.user.surname}`}
              specialities={doctor.specialities}
              description={doctor.description}
              rate={doctor.avgRate}
              id={doctor.id}
              photo={doctor.user.image}
            />
          ))}
        </div>
      </section>
    </Layout>
  )
}

export const getServerSideProps = withAuth(async (auth: Auth | null, context: any) => {

  const { query } = context;
  
  try {
    const doctorsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/doctor?${new URLSearchParams(query).toString()}`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${context.req.cookies.token}` }
      });

    const doctorsData = doctorsResponse.data;

    return {
      props: {
        doctors: doctorsData,
        auth,
      }
    }
  }

  catch {
    return {
      props: {
        doctors: { items: [] },
        auth
      }
    }
  };


}, true)