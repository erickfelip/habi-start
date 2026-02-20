import { useState, useEffect } from "react";
import moment from "moment";

export const useGreeting = () => {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const localHour = moment().hour();
    let newGreeting = "";

    if (localHour >= 6 && localHour < 12) {
      newGreeting = "Bom dia";
    } else if (localHour >= 12 && localHour < 18) {
      newGreeting = "Boa tarde";
    } else {
      newGreeting = "Boa noite";
    }

    setGreeting(newGreeting);
  }, []);

  return greeting;
};
