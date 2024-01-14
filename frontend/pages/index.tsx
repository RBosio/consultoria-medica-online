import withAuth from '@/lib/withAuth'
import { Auth } from '../../shared/types';
import axios from 'axios';
import Layout from '@/components/layout';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, ToggleButton, ToggleButtonGroup, useTheme } from '@mui/material';
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
import Autocomplete from '@mui/material/Autocomplete';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaArrowDownShortWide } from "react-icons/fa6";
import { FaArrowUpWideShort } from "react-icons/fa6";

export default function Home(props: any) {

  const theme = useTheme();
  const router = useRouter();

  const filtersForm = useFormik({
    initialValues: {
      name: '',
      specialityId: '',
      planId: '',
      avgRate: '',
      seniority: '',
      orderByField: 'none',
    },
    onSubmit: async (values, { setSubmitting }) => {
      const valuesCpy = { ...values, orderBy: "" };
      valuesCpy.orderBy = values.orderByField === "none" ? "" : `${values.orderByField}_${orderDirection}`;
      router.push(`/?${new URLSearchParams(valuesCpy).toString()}`);
      setSubmitting(false);

    },
  });

  const [orderDirection, setOrderDirection] = useState('asc');
  const handleOrderChange = (event: React.MouseEvent<HTMLElement>, nextOrderDirection: string) => {
    if (nextOrderDirection !== null) {
      setOrderDirection(nextOrderDirection);
    };
  };

  return (
    <Layout auth={props.auth}>
      <section className='h-full flex flex-col xl:flex-row'>
        <div className="bg-white shadow-xl h-20 w-full xl:min-w-64 xl:w-4/12 xl:h-full">
          <h2 className={`${robotoBold.className} text-primary text-xl text-center my-4`}>Filtrar</h2>
          <div className="px-4 w-full">
            <Divider />
            <form onSubmit={filtersForm.handleSubmit} className="py-3 flex flex-col gap-8">
              <Input name="name" onChange={filtersForm.handleChange} startadornment={<FaUserDoctor color={theme.palette.primary.main} />} fullWidth label="Nombre" />
              <Autocomplete
                onChange={(event, newValue: any) => {
                  filtersForm.setFieldValue('specialityId', newValue ? newValue.id : "");
                }}
                disablePortal
                noOptionsText="Especialidad no encontrada"
                options={props.specialities.map((spec: any) => ({ id: spec.id, label: spec.name }))}
                renderInput={(params: any) => <Input onChange={filtersForm.handleChange} name="specialityId" {...params} label="Especialidad" />}
              />
              <Autocomplete
                onChange={(event, newValue: any) => {
                  filtersForm.setFieldValue('planId', newValue ? newValue.id : "");
                }}
                disablePortal
                noOptionsText="Obra Social no encontrada"
                options={props.healthInsurances.map((hi: any) => ({ id: hi.id, label: hi.name }))}
                renderInput={(params: any) => <Input onChange={filtersForm.handleChange} name="planId" {...params} label="Obra Social" />}
              />
              <Slider name="avgRate" onChange={filtersForm.handleChange} icon={<IoStar />} label='Puntuación mayor que' marks={[{ value: 0, label: "0" }, { value: 2.4, label: "2.4" }, { value: 4.8, label: "4.8" }]} defaultValue={0} step={0.1} max={4.8} aria-label="Default" valueLabelDisplay="auto" />
              <Slider name="seniority" onChange={filtersForm.handleChange} icon={<IoMdTime />} label='Experiencia mayor que' marks={[{ value: 0, label: "0" }, { value: 15, label: "15" }, { value: 30, label: "30" }]} defaultValue={0} max={30} aria-label="Default" valueLabelDisplay="auto" />
              <div className="flex justify-between items-center">
                <FormControl>
                  <FormLabel id="demo-radio-buttons-group-label">Ordenar por</FormLabel>
                  <RadioGroup
                    defaultValue="none"
                    onChange={filtersForm.handleChange}
                    aria-labelledby="radio order"
                    name="orderByField"
                  >
                    <FormControlLabel value="none" control={<Radio size='small' />} label="Ninguno" />
                    <FormControlLabel value="name" control={<Radio size='small' />} label="Nombre" />
                    <FormControlLabel value="rate" control={<Radio size='small' />} label="Puntuación" />
                    <FormControlLabel value="seniority" control={<Radio size='small' />} label="Años de Experiencia" />
                  </RadioGroup>
                </FormControl>
                <ToggleButtonGroup
                  sx={{
                    ".MuiButtonBase-root.MuiToggleButton-root.Mui-selected": {
                      background: theme.palette.primary.light
                    }
                  }}
                  orientation="vertical"
                  value={orderDirection}
                  onChange={handleOrderChange}
                  exclusive
                >
                  <ToggleButton value="asc" aria-label="asc">
                    <FaArrowUpWideShort />
                  </ToggleButton>
                  <ToggleButton value="desc" aria-label="desc">
                    <FaArrowDownShortWide />
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>
              <Button className='mt-[4rem]' type='submit' size='large' startIcon={<IoMdSearch />}>Buscar</Button>
            </form>
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
    let doctors = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/doctor?${new URLSearchParams(query).toString()}`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${context.req.cookies.token}` }
      });

    doctors = doctors.data;

    let healthInsurances = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/healthInsurance`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${context.req.cookies.token}` }
      });

    healthInsurances = healthInsurances.data;

    let specialities = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/speciality`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${context.req.cookies.token}` }
      });

    specialities = specialities.data;

    return {
      props: {
        doctors,
        auth,
        specialities,
        healthInsurances,
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