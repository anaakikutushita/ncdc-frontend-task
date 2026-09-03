import logo from "@/assets/logo.svg";

export const LogoLockup = () => {
  return (
    <h1
      className={[
        "grid grid-cols-[32px_auto] grid-rows-1 gap-2 items-center",
        "text-2xl font-bold",
      ].join(" ")}
    >
      <img src={logo} alt="Logo" />
      ServiceName
    </h1>
  );
};
