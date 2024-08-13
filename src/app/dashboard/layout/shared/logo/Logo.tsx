import Link from "next/link";
import { styled } from "@mui/material";
import Image from "next/image";

const LinkStyled = styled(Link)(() => ({
  height: "100px",
  width: "100px",
  overflow: "hidden",
  borderRadius: '50%',
  display: "block",
}));

const Logo = () => {
  return (
    <LinkStyled href="/">
      <Image src="/quick.jpg" style={{ objectFit: 'cover' }} width={200} height={200} alt="logo" priority />
    </LinkStyled>
  );
};

export default Logo;
