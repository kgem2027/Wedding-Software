import React from 'react'
import venue1 from './images/venue1.jpg'
import aboutMePicture2 from './images/aboutMePicture2.jpg'

export default function AboutUs() {
  return (
    <div className="flex justify-center mt-20 mx-10">
      <div className="bg-[#92a5e8]/50 p-10 rounded-3xl flex flex-row items-center gap-8 w-fit">
        <img 
          src={venue1}
          alt="venue"
          className="w-[400px] h-auto rounded-3xl shadow-lg flex-shrink-0"
        />
        <div className="flex flex-col items-center">
          <h2 className="info-title-text max-w-md pb-5 text-center text-white-100 text-5xl">About Us</h2>        
          <p className="max-w-lg pb-5 text-center text-white-100 text-2xl info-text font-bold">
            We created our wedding planning platform with one simple goal in mind: to make the journey to your big day feel just as special as the day itself. Planning a wedding can be overwhelming, so we built a space where everything you need lives in one place—organized, intuitive, and designed with real couples in mind. From managing guest lists and timelines to tracking budgets and personal details, our platform helps turn big ideas into seamless plans. Whether you're dreaming of something elegant and traditional or modern and unique, we're here to support every step, so you can focus on what truly matters—celebrating your story.
          </p>
        </div>
        <img 
          src={aboutMePicture2}
          alt="aboutMePicture2"
          className="w-[400px] h-auto rounded-3xl shadow-lg flex-shrink-0"
        />
      </div>
    </div>
  )
}