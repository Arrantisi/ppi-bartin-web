import { SelectContent, SelectGroup, SelectItem } from "./ui/select";
import dataKampus from "@/server/data/bartin-university-jurusan.json";

const statusPelajarItems = ["TÖMER", "D2", "D3", "S1", "S2", "S3"];
const angkatanItems = ["2020", "2021", "2022", "2023", "2024", "2025"];
const jenisKelaminItems = ["laki-laki", "perempuan"];

export const SelectFakultas = () => {
  return (
    <SelectContent>
      <SelectGroup>
        {dataKampus.map((item) => (
          <SelectItem key={item.fakultas} value={item.fakultas || ""}>
            {item.fakultas}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  );
};

export const SelectJurusan = ({ fakultas }: { fakultas: string }) => {
  const items =
    dataKampus.find((data) => data.fakultas === fakultas)?.jurusan ?? [];

  return (
    <SelectContent>
      <SelectGroup>
        {items.map((item) => (
          <SelectItem key={item} value={item || ""}>
            {item}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  );
};

export const SelectStatusPelajar = () => {
  return (
    <SelectContent>
      <SelectGroup>
        {statusPelajarItems.map((item, idx) => (
          <SelectItem key={item + idx} value={item || ""}>
            {item}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  );
};

export const SelectAngkatan = () => {
  return (
    <SelectContent>
      <SelectGroup>
        {angkatanItems.map((item) => (
          <SelectItem key={item} value={item || ""}>
            {item}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  );
};

export const SelectJenisKelamin = () => {
  return (
    <SelectContent>
      <SelectGroup>
        {jenisKelaminItems.map((item) => (
          <SelectItem key={item} value={item || ""}>
            {item}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  );
};
