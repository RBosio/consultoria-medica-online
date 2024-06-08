import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

interface PaginatorProps {
  pages: number;
  route: string;
}

const Paginator: React.FC<PaginatorProps> = (props) => {
  const router = useRouter();

  return (
    <div className="flex justify-end items-center gap-2 text-primary">
      <Link
        href={`${props.route}?page=${
          router.query.page && Number(router.query.page) > 1
            ? Number(router.query.page) - 1
            : 1
        }`}
      >
        <FaChevronLeft className="text-2xl" />
      </Link>
      <Link
        href={`${props.route}?page=${
          router.query.page && Number(router.query.page) < props.pages
            ? Number(router.query.page) + 1
            : props.pages
        }`}
      >
        <FaChevronRight className="text-2xl" />
      </Link>
      <p className="text-md">
        Página {router.query.page ? router.query.page : 1} -{" "}
        {props.pages === 0 ? 1 : props.pages}
      </p>
    </div>
  );
};

export default Paginator;
