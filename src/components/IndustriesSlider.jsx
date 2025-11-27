"use client";
import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const categories = [
    { image: "/clientcategories/software-developer.jpg", name: "Software Developer" },
    { image: "/clientcategories/frontend-developer.jpg", name: "Frontend Developer" },
    { image: "/clientcategories/backend-developer.avif", name: "Backend Developer" },
    { image: "/clientcategories/fullstack-developer.jpg", name: "Full Stack Developer" },
    { image: "/clientcategories/ui-ux-designer.avif", name: "UI/UX Designer" },
    { image: "/clientcategories/digital-marketer.avif", name: "Digital Marketing Specialist" },
    { image: "/clientcategories/seo-expert.avif", name: "SEO Expert" },
    { image: "/clientcategories/content-writer.jpg", name: "Content Writer" },
    { image: "/clientcategories/social-media-manager.avif", name: "Social Media Manager" },
    { image: "/clientcategories/graphic-designer.webp", name: "Graphic Designer" },
    { image: "/clientcategories/data-analyst.avif", name: "Data Analyst" },
    { image: "/clientcategories/devops-engineer.avif", name: "DevOps Engineer" },
    // { image: "/clientcategories/cyber-security.jpg", name: "Cyber Security Specialist" },
    // { image: "/clientcategories/cloud-engineer.jpg", name: "Cloud Engineer" },
    // { image: "/clientcategories/hr-it-recruiter.jpg", name: "HR Recruiter (IT)" }
];

const IndustriesSlider = () => {

    const settings = {
        dots: false,
        infinite: true,
        speed: 600,
        autoplay: true,
        autoplaySpeed: 2000,
        slidesToShow: 6,
        slidesToScroll: 1,

        responsive: [
            { breakpoint: 1280, settings: { slidesToShow: 5 } },
            { breakpoint: 1024, settings: { slidesToShow: 4 } },
            { breakpoint: 768, settings: { slidesToShow: 3 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } },
        ]
    };

    return (
        <div className="py-10 px-4 relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
                <h2 className="text-gray-900 font-bold text-center mb-2 lg:px-3"
                    style={{ fontFamily: "'Roboto Slab', serif", fontSize: "2rem" }}>
                    Industries We Serve
                </h2>

                <p className="text-center text-gray-900 md:text-lg text-sm">
                    Our Circle of Excellence
                </p>

                <div className="px-10 lg:px-5">
                    <Slider {...settings}>
                        {categories.map((category, index) => (
                            <div key={index} className="px-3 pt-5">

                                <div className="
                                    w-full h-[200px]
                                    bg-transparent
                                    border border-gray-800
                                    rounded-2xl
                                    overflow-hidden
                                    flex flex-col
                                    transition-all duration-300
                                    hover:-translate-y-1
                                ">

                                    {/* FULL IMAGE ON TOP */}
                                    <div className="w-full h-[140px]">
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className="w-full h-full object-cover text-gray-900"
                                        />
                                    </div>

                                    {/* TITLE BELOW */}
                                    <div className="flex items-center justify-center h-[60px] px-2">
                                        <h3 className="text-sm font-semibold text-gray-900 text-center">
                                            {category.name}
                                        </h3>
                                    </div>

                                </div>

                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </div>
    );
};

export default IndustriesSlider;
