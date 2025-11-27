import React from "react";
import { FaCode, FaBullhorn, FaUserCheck, FaRocket, FaLaptopCode } from "react-icons/fa";

const About = () => {
    return (
        <section className="py-20 px-6 bg-gray-50">
            <div className="max-w-6xl mx-auto text-center">

                {/* Title */}
                <h2 className="text-4xl font-bold text-indigo-700 mb-4" style={{ fontFamily: "'Roboto Slab', serif",  }}>
                    About Us
                </h2>

                {/* Subheading */}
                <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-14">
                    A future-ready platform connecting the best talent in{" "}
                    <span className="font-semibold text-indigo-700">IT</span> &
                    <span className="font-semibold text-indigo-700"> Digital Marketing</span>{" "}
                    with companies that value innovation and real skill.
                </p>

                {/* TOP ROW (3 CARDS) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

                    {/* Card 1 */}
                    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition">
                        <FaCode className="text-indigo-600 text-4xl mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2 text-gray-800" style={{ fontFamily: "'Roboto Slab', serif",  }}>Tech + Marketing Focus</h3>
                        <p className="text-gray-600 text-sm">
                            Opportunities in development, SEO, paid ads, content, UI/UX & more.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition">
                        <FaUserCheck className="text-indigo-600 text-4xl mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2 text-gray-800" style={{ fontFamily: "'Roboto Slab', serif",  }}>Verified Employers</h3>
                        <p className="text-gray-600 text-sm">
                            Work with trusted companies hiring top digital talent.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition">
                        <FaRocket className="text-indigo-600 text-4xl mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2 text-gray-800" style={{ fontFamily: "'Roboto Slab', serif",  }}>Career Growth</h3>
                        <p className="text-gray-600 text-sm">
                            Find roles that help you grow faster in today’s digital world.
                        </p>
                    </div>
                </div>

                {/* BOTTOM ROW (2 CARDS CENTERED) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-3xl mx-auto">

                    {/* Card 4 */}
                    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition">
                        <FaBullhorn className="text-indigo-600 text-4xl mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2 text-gray-800" style={{ fontFamily: "'Roboto Slab', serif"}}>Marketing Excellence</h3>
                        <p className="text-gray-600 text-sm">
                            Explore roles in performance marketing, branding, analytics & more.
                        </p>
                    </div>

                    {/* Card 5 */}
                    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition">
                        <FaLaptopCode className="text-indigo-600 text-4xl mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2 text-gray-800" style={{ fontFamily: "'Roboto Slab', serif" }}>Skill-Based Hiring</h3>
                        <p className="text-gray-600 text-sm">
                            We focus on real skills—not degrees—connecting talent with the right jobs.
                        </p>
                    </div>

                </div>

            </div>
        </section>
    );
};

export default About;
