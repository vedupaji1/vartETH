import React from "react";

const PageFooter = () => {
    let divData = [
        {
            link: "https://www.youtube.com/channel/UCLYh239Pl56prNR5YGZWxHw",
            newClass: "fa fa-2x fa-youtube-play",
            style: { color: "#FF0000", backgroundColor: 'white ' }
        },
        {
            link: "https://www.facebook.com/panchal.vedant.96",
            newClass: "fa fa-2x fa-facebook",
            style: { backgroundColor: "#4267B2" }
        },
        {
            link: "https://www.instagram.com/vedupaji/",
            newClass: "fa fa-2x fa-instagram",
            style: { backgroundColor: "#cd486b" }
        },
        {
            link: "https://twitter.com/Vedupaji4",
            newClass: "fa fa-2x fa-twitter",
            style: { backgroundColor: "#1DA1F2" }
        }]
    return (
        <>
            <footer>
                <div className="lococo">
                    {
                        divData.map((data, index) => (
                            <a key={index} href={data.link}>
                                <div style={data.style} id={"ffo" + (index + 1)} className="ffo"><i className={data.newClass}></i></div>
                            </a>
                        ))
                    }
                </div>
                <div>
                    <p style={{ color: ' white', fontSize: '150%', fontFamily: 'Arial, Helvetica, sans-serif', marginBottom: '3rem' }}>By, Vedupaji</p>
                </div>
            </footer>
        </>
    )
}

export default PageFooter;