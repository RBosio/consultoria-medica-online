import withAuth from '@/lib/withAuth'
import { Auth } from '../../../shared/types';
import axios from 'axios';
import Layout from '@/components/layout';
import { Fab, FormControl, FormControlLabel, FormLabel, IconButton, Pagination, Radio, RadioGroup, ToggleButton, ToggleButtonGroup, useTheme } from '@mui/material';
import Doctor from '@/components/doctor';
import { robotoBold } from '@/lib/fonts';
import Divider from '@mui/material/Divider';
import Input from '@/components/input';
import Button from '@/components/button';
import Slider from '@/components/slider';
import Autocomplete from '@mui/material/Autocomplete';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import React, { useState, useRef, RefObject } from 'react';
import { FaArrowDownShortWide, FaArrowUpWideShort, FaUserDoctor } from "react-icons/fa6";
import { FaFilter } from "react-icons/fa";
import { IoStar } from "react-icons/io5";
import { IoMdTime, IoMdSearch } from "react-icons/io";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function Doctors(props: any) {

  const [openedFilters, setOpenedFilters] = useState(false);

  const theme = useTheme();
  const router = useRouter();
  const ref: RefObject<any> = useRef(null);

  const onPageChange = async (ev: React.ChangeEvent<unknown>, page: number) => {
    const queryWPage = new URLSearchParams({ ...router.query, page: page.toString() }).toString();
    await router.push(`${router.pathname}?${queryWPage}`);
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Layout auth={props.auth}>
      <section className='h-full flex flex-col xl:flex-row overflow-hidden'>
        <Filters setOpenedFilters={setOpenedFilters} openedFilters={openedFilters} healthInsurances={props.healthInsurances} specialities={props.specialities} />
        <div className="w-full p-4 sm:p-10 grow overflow-x-hidden flex flex-col items-center gap-10 relative">
          <p className="absolute invisible top-[-4rem]" ref={ref}>q</p>
          {
            props.doctors.items.length === 0 ?
              <h2 className="text-xl absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-center">No se encontraron resultados</h2>
              :
              props.doctors.items.map((doctor: any) => (
                <Doctor
                  key={doctor.id}
                  fullName={`${doctor.user.name} ${doctor.user.surname}`}
                  specialities={doctor.specialities}
                  description={doctor.description}
                  rate={Number(doctor.avgRate)}
                  id={doctor.id}
                  photo={doctor.user.image}
                />
              ))
          }
          {props.doctors.items.length > 0 &&
            <div className="bg-primary p-4 w-full flex justify-center items-center rounded-md shadow-md">
              <Pagination page={Number(props.doctors.currentPage)} sx={{
                "& .MuiPaginationItem-root": {
                  color: "#ffffff",
                  fontSize: "1em",
                  margin: "0 6px",
                  borderColor: "#E8E8E8",
                },
                "& .MuiPaginationItem-root.Mui-selected": {
                  background: "#ffffff",
                  color: theme.palette.primary.main,
                  fontWeight: "bold",
                },
                "& .MuiPaginationItem-root.Mui-selected:hover": {
                  background: "#E8E8E8",
                }
              }} count={props.doctors.totalPages} onChange={onPageChange} variant='outlined' shape="rounded" />
            </div>}
        </div>
        <Fab onClick={() => setOpenedFilters(true)} variant='extended' className="z-0 bg-secondary hover:bg-[#4F4F4F] absolute bottom-4 right-8 text-white xl:hidden">
          <FaFilter className="mr-2" />
          FILTROS
        </Fab>
      </section>
    </Layout>
  )
}

interface FiltersProps {
  specialities: any,
  healthInsurances: any,
  openedFilters: boolean,
  setOpenedFilters: any,
}

const Filters: React.FC<FiltersProps> = (props) => {

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
      router.push(`${router.pathname}?${new URLSearchParams(valuesCpy).toString()}`);
      props.setOpenedFilters(false);
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
    <div className={`h-full bg-white transition-[right] duration-300 ease-in-out ${props.openedFilters ? "right-0" : "right-[-63rem]"} 
    z-10 shadow-xl absolute w-full md:w-[calc(100%-15rem)] overflow-y-auto 
    xl:z-0 xl:static xl:min-w-64 xl:w-4/12 xl:rounded-md xl:m-6 xl:h-auto`}>
      <span className="flex items-center justify-center">
        <h2 className={`${robotoBold.className} text-primary text-xl my-4`}>Filtrar</h2>
        <IconButton onClick={() => props.setOpenedFilters(false)} className="absolute right-0 xl:hidden" color="error">
          <IoIosCloseCircleOutline color="#D92222" size="30" />
        </IconButton>
      </span>
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
          <Button className="mt-[4rem] xl:mt-0" type='submit' size='large' startIcon={<IoMdSearch />}>Buscar</Button>
        </form>
      </div>
    </div>
  )
};

export const getServerSideProps = withAuth(async (auth: Auth | null, context: any) => {

  let { query } = context;

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