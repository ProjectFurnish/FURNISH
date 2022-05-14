import React from 'react'
import './Home.css'
import home from '../../asset/home.jpg'
import { useHistory } from "react-router-dom";

export default function Home(props) {
    let history = useHistory();
    let setUrl = props.setUrl;

    return (
        <div className="home">
            <div className="first-picture-container">
                <div className="cover"></div>
                <div className="picture-contianer">
                    <img src={home} className="first-picture" alt="homePageImg" />
                </div>

                <div className="middle">
                    <div className="text">
                        <h3>רוצה לחדש את הבית?</h3>
                        <p>
                            כאן תוכל למכור את רהיטיך הישנים, ולקנות רהיטים בזול
                        </p>
                        <p>
                            לרהט ולחדש את מראה הבית בהוצאה מינימלית
                        </p>

                        <h5>והכול במקום אחד, בנוחות ובקלות</h5>
                    </div>
                </div>
            </div>
            <div className="imgs">

                <div className="container2">
                    <img src="https://i.pinimg.com/564x/f3/6f/22/f36f2228f836aaf790322a2df1235c69.jpg" alt="closet" className="image" />
                    <div className="overlay">
                        <div className="text2">
                            <button onClick={() => {
                                history.push("/closet");
                                setUrl("/closet");
                            }
                            }>ארונות</button>
                        </div>
                    </div>
                </div>
                <div className="container2" id="space">
                    <img src="https://www.happybeds.co.uk/media/catalog/product/cache/2760f187cb7d1bcdeca5818f247800d3/u/r/urban_rustic_bed_1.jpg" alt="bed" className="image" />
                    <div className="overlay">
                        <div className="text2">
                            <button onClick={() => {
                                history.push("/bed");
                                setUrl("/bed");
                            }
                            }>מיטות</button>
                        </div>
                    </div>
                </div>
                <div className="container2" >
                    <img src="https://i.pinimg.com/564x/be/7e/4d/be7e4d89f0de7bf1f23605bd661721d3.jpg" alt="table" className="image" />
                    <div className="overlay">
                        <div className="text2">
                            <button onClick={() => {
                                history.push("/table");
                                setUrl("/table");
                            }
                            }>שולחנות</button>
                        </div>
                    </div>
                </div>

                <div className="container2" id="space">
                    <img src="https://i.pinimg.com/564x/9f/14/da/9f14dab45d3b483cdc314b1a1a1e1617.jpg" alt="chair" className="image" />
                    <div className="overlay">
                        <div className="text2">
                            <button onClick={() => {
                                history.push("/chair");
                                setUrl("/chair");
                            }
                            }>כסאות</button>
                        </div>
                    </div>
                </div>

                <div className="container2">
                    <img
                        src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/amazon-rivet-furniture-1533048038.jpg?crop=1.00xw:0.502xh;0,0.425xh&resize=980:*"
                        alt="sofa"
                        className="image" />
                    <div className="overlay">
                        <div className="text2">
                            <button onClick={() => {
                                history.push("/sofa");
                                setUrl("/sofa");
                            }
                            }>ספות</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
