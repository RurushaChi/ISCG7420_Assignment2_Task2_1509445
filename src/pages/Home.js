import React from "react";

export default function Home() {
  return (
    <div className="container mt-4">
      <div className="text-center mb-4">
        <h1>Welcome to the Conference Room Booking System</h1>
        <p>Select from the navbar to get started.</p>
      </div>

      <div id="homepageCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="/images/slide1.jpg" className="d-block w-100" alt="Slide 1" />
          </div>
          <div className="carousel-item">
            <img src="/images/slide2.jpg" className="d-block w-100" alt="Slide 2" />
          </div>
          <div className="carousel-item">
            <img src="/images/slide3.jpg" className="d-block w-100" alt="Slide 3" />
          </div>
          <div className="carousel-item">
            <img src="/images/slide4.jpg" className="d-block w-100" alt="Slide 4" />
          </div>
          <div className="carousel-item">
            <img src="/images/slide5.jpg" className="d-block w-100" alt="Slide 5" />
          </div>
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#homepageCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#homepageCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}
