import Image from "next/image";
import loader from "@/assets/loader.gif";
const loadingStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  width: "100vw",
};
const loading = () => {
  return (
    <div style={loadingStyle}>
      <Image src={loader} width={150} height={150} alt="laoding..." />
    </div>
  );
};

export default loading;
