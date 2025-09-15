import { useQuery } from "@tanstack/react-query";
import api from "../../lib/axios/axios";
import { API_ROUTES } from "../../lib/api";
import type { DcEntryQueryResponse } from "./Dc";
import type { MaterialInvoicesQueryResponse } from "./Invoices";

export default function Home() {

  const dcQuery = useQuery({
    queryKey: ['dc-entries'],
    queryFn: async () => {
      const res = await api.get<DcEntryQueryResponse>(API_ROUTES.MATERIAL_DCS.LIST_MATERIAL_DCS);
      return res.data;
    }
  })

  const marterilaInvoicesQuery = useQuery({
    queryKey: ['material-invoices'],
    queryFn: async () => {
      const res = await api.get<MaterialInvoicesQueryResponse>(API_ROUTES.MATERIAL_INVOICES.LIST_MATERIAL_INVOICES);
      return res.data;
    }
  })

  return (
    <></>
  )
}