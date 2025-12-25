import { Input } from "@/components/ui/input";
import PaperIcon from "../icons/PaperIcon";
import StarIcon from "../icons/staricon";
import { Input2 } from "@/components/ui/input2";
import { ButtonSecondary } from "@/components/ui/btn";

const MainPage = () => {
  return (
    
      
    <div className="w-214 h-110.5 border border-solid gap-20 rounded-lg p-7">
      <div className="flex gap-2">
        <StarIcon />
        <h3 className="text-black font-semibold Semi Bold text-2xl">
          Article Quiz Generator
        </h3>
      </div>
      <p className="font-inter mt-2 text-base font-normal leading-[1.2] tracking-normal text-[#71717A]">
        Paste your article below to generate a summarize and quiz question. Your
        articles will saved in the sidebar for future reference.
      </p>

      <div className="flex items-center gap-2 mt-5">
        <PaperIcon />
        <p className="text-sm font-semibold leading-5 tracking-normal text-[#71717A]">
          Article Title
        </p>
      </div>
      <Input className="mt-2" />
      <div className="flex mt-5">
        <PaperIcon />
        <p className="text-sm font-semibold leading-5 tracking-normal text-[#71717A]">
          Article Content
        </p>
      </div>
      <Input2 className="mt-2" />
      <div className="flex justify-end mt-2">
        <ButtonSecondary />
      </div>
    </div>
   
  );
};
export default MainPage;
