export class CreateBillingDto {
  month: number;
  year: number;
  doctorId: number;
  billings: BillingDto[];
}

class BillingDto {
  doctorId: number;
  total: number;
  cbu: string;
}
