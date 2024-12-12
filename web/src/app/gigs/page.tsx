import dynamic from "next/dynamic";

// Dynamically import a component with SSR disabled
const ClientSideComponent = dynamic(
  () => import("@/components/pages/GigsPage"),
  {
    ssr: false, // Disables SSR for this component
  }
);

const page = () => {
  return (
    <div>
      <ClientSideComponent />
    </div>
  );
};

export default page;
