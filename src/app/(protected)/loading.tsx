import Image from "next/image";
import Spinner from "@/src/assets/Spinner.gif";

const Loading = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Image
        src={Spinner}
        alt={"Loading..."}
        width={120}
        height={120}
        priority
      />
    </div>
  );
};

export default Loading