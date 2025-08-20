"use client";

import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import Image from "next/image";

const AboutUs = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-[16px] sm:gap-[24px]">
      <div>
        <Heading variant="h2" className="mb-[24px]">
          About us
        </Heading>
        <Text>
          FriedKeys is where great games meet great deals. We’re a team of
          passionate gamers who believe that everyone deserves fast, affordable,
          and secure access to the games they love.
          <br />
          <br />
          At FriedKeys, we believe great games shouldn’t come with a high price
          tag. That’s why we offer a huge selection of PC, Xbox, PlayStation,
          and Nintendo Switch titles — all at prices that make sense.
          <br />
          <br />
          From blockbuster hits to indie favorites, we’ve got thousands of games
          ready to unlock. And it’s not just games — grab discounts on game
          subscriptions, gift cards, in-game currency, and more.
          <br />
          <br />
          Trusted by gamers worldwide, we make buying digital keys fast, simple,
          and secure.
          <br />
          Whether you’re here for the deals or the convenience — you’re in good
          company.
        </Text>
      </div>
      <div className="w-full h-full">
        <Image
          src="/images/about.png"
          alt="Friedkeys team"
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default AboutUs;
