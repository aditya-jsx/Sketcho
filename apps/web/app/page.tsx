"use client"

import { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Home() {
  // todo: - we should use react forms instead of using a state variable
  const [rooomId, setRoomId] = useState("");

  const router = useRouter();


  return (
    <div className={styles.page}>
      <input 
        type="text" 
        placeholder="Room Id"
        onChange={(e)=>{setRoomId(e.target.value)}}
      />

      <button
        onClick={()=>{
          router.push(`/room/${rooomId}`);
        }}
      >
        Join Room
      </button>


    </div>
  );
}


// todo:-  add tailwind in this project
// todo:- now here's a thing that instead of giving a room id people will give us a slug, and we have to convert the slug into a room id using a endpoint, made in http-server