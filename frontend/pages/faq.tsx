import React from "react";
import "moment/locale/es";
import { Auth } from "../types";
import withAuth from "@/lib/withAuth";
import Layout from "@/components/layout";
import { roboto, robotoBold } from "@/lib/fonts";
import { Accordion as MuiAccordion, AccordionDetails as MuiAccordionDetails, AccordionProps, AccordionSummary as MuiAccordionSummary, AccordionSummaryProps, styled } from "@mui/material";
import { FaChevronDown } from "react-icons/fa6";
import faq from '../public/faq.json';

export default function Faq(props: any) {

    const type = props.auth.role === 'doctor' ? 'doctor' : 'user';

    const Accordion = styled((props: AccordionProps) => (
        <MuiAccordion disableGutters elevation={0} square {...props} />
    ))(({ theme }) => ({
        border: `1px solid ${theme.palette.divider}`,
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&::before': {
            display: 'none',
        },
    }));

    const AccordionSummary = styled((props: AccordionSummaryProps) => (
        <MuiAccordionSummary
            expandIcon={<FaChevronDown />}
            {...props}
        />
    ))(({ theme }) => ({
        fontWeight: 'bold',
        backgroundColor: 'rgba(0, 0, 0, .03)',
        flexDirection: 'row-reverse',
        '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
            transform: 'rotate(90deg)',
        },
        '& .MuiAccordionSummary-content': {
            marginLeft: theme.spacing(1),
        },
    }));

    const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
        padding: theme.spacing(2),
        borderTop: '1px solid rgba(0, 0, 0, .125)',
    }));

    return (
        <Layout auth={props.auth}>
            <section className={`flex justify-center ${roboto.className} p-10 h-full`}>
                <div className="bg-white p-4 flex flex-col rounded-md shadow-md w-full overflow-y-auto">
                    <h2 className={`${robotoBold.className} mb-4 text-primary text-2xl`}>Preguntas Frecuentes</h2>
                    <div>
                        {
                            [...faq.both, ...faq[type]].map(q => (
                                <Accordion key={q.id}>
                                    <AccordionSummary
                                        expandIcon={<FaChevronDown />}
                                    >
                                        {q.question}
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {q.answer}
                                    </AccordionDetails>
                                </Accordion>
                            ))
                        }
                    </div>
                </div>
            </section>
        </Layout>
    );
}

export const getServerSideProps = withAuth(
    async (auth: Auth | null, context: any) => {

        return {
            props: {
                auth,
            },
        };
    },
    { protected: true, roles: ['user', 'doctor', 'admin'] }
);
