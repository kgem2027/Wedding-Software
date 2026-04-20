import React from 'react'
import whatWeOffer1 from './images/whatWeOffer1.jpg'
import whatWeOffer2 from './images/whatWeOffer2.jpg'

export default function Offer() {
  return (
    <div className="flex justify-center mt-20 mx-10">
      <div className="bg-[#92a5e8]/50 p-10 rounded-3xl flex flex-row items-center gap-8 w-fit">
        <img 
          src={whatWeOffer1}
          alt="whatWeOffer1"
          className="w-[400px] h-auto rounded-3xl shadow-lg flex-shrink-0"
        />
        <div className="flex flex-col items-center">
          <h2 className="info-title-text max-w-md pb-5 text-center text-white-100 text-5xl">What We Offer</h2>
          <p className = "max-w-md ml-10 pb-5 text-center text-white-100 text-2xl info-text font-bold">
        All-in-One Planning – Keep tasks, budgets, and guest lists in one place

        Smart Organization – Stay on track with timelines and reminders

        User-Friendly Design – Simple, clean interface built for real users

        Personalization – Customize your plans to match your unique wedding vision
        </p>
    </div>
        <img 
          src={whatWeOffer2}
          alt="whatWeOffer2"
          className="w-[400px] h-auto rounded-3xl shadow-lg flex-shrink-0"
        />
      </div>
    </div>
  )
}
