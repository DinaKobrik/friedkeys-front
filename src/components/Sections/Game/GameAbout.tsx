"use client";

import React, { useEffect, useState } from "react";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import { useParams } from "next/navigation";
import { Game } from "@/types/game";
import Image from "next/image";

const GameAbout: React.FC = () => {
  const params = useParams();
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      const id = params?.id as string;
      if (!id) return;

      try {
        const response = await fetch(`/api/games?type=game&id=${id}`);
        if (!response.ok) throw new Error("Failed to fetch game");
        const data = await response.json();
        if (Array.isArray(data)) {
          const foundGame = data.find((g) => g.id === Number(id));
          setGame(foundGame || null);
        } else if (data.id) {
          setGame(data);
        } else {
          setGame(null);
        }
      } catch (error) {
        console.error("Failed to fetch game:", error);
        setGame(null);
      }
    };

    fetchGame();
  }, [params]);

  if (!game) return <Heading variant="h3">Loading...</Heading>;

  const formatReleaseDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const aboutSpecs = [
    { label: "Installation", value: "How to activate game" },
    { label: "Rating", value: game.rating },
    { label: "Release Date", value: formatReleaseDate(game.releaseDate) },
    { label: "Publisher", value: "—" },
    { label: "Genre", value: game.genres.join(" ") },
    { label: "Languages", value: "—" },
  ];

  return (
    <section className="grid grid-cols-1 xl:grid-cols-2 gap-[40px] items-start w-full">
      <div>
        <Heading variant="h1" className="mb-[24px] sm:mb-[40px]">
          About
        </Heading>
        <Text>
          Hogwarts Legacy is an open-world action RPG set in the world first
          introduced in the Harry Potter books. Embark on a journey through
          familiar and new locations as you explore and discover magical beasts,
          customize your character and craft potions, master spell casting,
          upgrade talents and become the wizard you want to be.
          <br />
          <br />
          Experience Hogwarts in the 1800s. Your character is a student who
          holds the key to an ancient secret that threatens to tear the
          wizarding world apart. Make allies, battle Dark wizards, and
          ultimately decide the fate of the wizarding world. Your legacy is what
          you make of it. Live the Unwritten.
        </Text>
      </div>
      <div className="relative md:hidden mx-auto pb-[45px] sm:pb-[70px] mb:pb-0 mt-[39px]">
        <Image
          src="/images/bg-steam.png"
          alt="steam"
          width={196}
          height={92}
          className="w-[169px] h-[80px] sm:w-[196px] sm:h-[92px]"
        />
        <div className="absolute top-[17px] left-1/2 translate-x-[-50%] w-full ">
          <div className="text-[32px] leading-[26px] sm:text-[48px] sm:leading-[48px] font-usuzi-condensed text-primary-main text-center mb-[15px]">
            10
          </div>
          <div className="text-[15px] leading-[19px] sm:text-[20px] sm:leading-[26px] text-white text-center">
            Based on
            <br />
            1177 reviews
            <br />
            on Steam
          </div>
        </div>
      </div>
      <div className="card-corner p-[40px] bg-2 flex justify-between gap-[10px]">
        <div className="grid grid-cols-[auto_1fr] items-start gap-[40px]">
          {aboutSpecs.map((spec, index) => (
            <React.Fragment key={index}>
              <div className="text-[15px] leading-[20px] sm:text-[20px] sm:leading-[26px] font-bold text-white">
                {spec.label}
              </div>
              <Text>{spec.value}</Text>
            </React.Fragment>
          ))}
        </div>
        <div className="relative hidden md:block">
          <Image
            src="/images/bg-steam.png"
            alt="steam"
            width={196}
            height={92}
          />
          <div className="absolute top-[5px] left-1/2 translate-x-[-50%] w-full">
            <div className="text-[32px] leading-[26px] sm:text-[48px] sm:leading-[48px] font-usuzi-condensed text-primary-main text-center mb-[15px]">
              10
            </div>
            <div className="text-[15px] leading-[19px] sm:text-[20px] sm:leading-[26px] text-white text-center">
              Based on
              <br />
              1177 reviews
              <br />
              on Steam
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GameAbout;
