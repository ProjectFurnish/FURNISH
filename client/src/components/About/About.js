import React, { useState } from 'react'
import './About.css'

export default function About() {

    const [userSide, setUserSide] = useState("seller")
    const [answersSeller, setAnswersSeller] = useState([false, false, false, false, false, false]);
    const [answersClient, setAnswersClient] = useState([false, false, false, false]);

    //open or close the answer
    function openCloseAnswer(index) {
        let answers;
        let setAnswers;
        if (userSide === "seller") {
            answers = answersSeller.slice();
            setAnswers = setAnswersSeller;
        }
        else {
            answers = answersClient.slice();
            setAnswers = setAnswersClient;
        }
        answers[index] = !answers[index];
        setAnswersSeller(answers);
        setAnswers(answers);
    }

    return (
        <div className="about">
            <div className="who-us">
                <h3>מי אנחנו?</h3>
                <h5>רוצים לחדש את הבית בלי לרוקן את הכיס? למכור את הרהיטים הישנים?</h5>
                <b>בשביל זה אנחנו כאן!</b>
                <p className="first-line">
                    חברת furni2h קמה מתוך מטרה לתווך בין אנשים שמעוניינים למכור את הרהיטים שלהם לבין האנשים שמעוניינים לקנות אותם.
                </p>
                <p>
                    באתר תוכלו להתרשם ממגוון רהיטים יד שנייה, לבצע תשלום- ולקבל את הרהיט עד הבית. כמו כן תוכלו להעלות למכירה רהיט שלכם ולאפשר למשתמשים אחרים לקנות אותו, והכול בנוחות ובקלות.
                </p>
            </div>


            <div className="how-work">

                <div className="clearfix-about">
                    <div className="content-about">
                        <div className="tabs-about">
                            <div className="button-container2"> <button onClick={() => { setUserSide("seller") }} className={userSide === "seller" ? "active" : "ns"}>אני רוצה למכור</button></div>
                            <div className="button-container2"> <button onClick={() => { setUserSide("client") }} className={userSide === "client" ? "active" : "ns"}>אני רוצה לקנות</button></div>
                        </div>

                        <div className="tabcontent-about">
                            <h3>איך זה עובד?</h3>
                            {userSide === "seller" &&
                                <div>
                                    <div className="text-about">
                                        <p>
                                            באיזור האישי תוכל לראות את רשימת המוצרים שאתה מוכר ולהוסיף מוצר.
                                        </p>
                                        <p>
                                            כאשר לקוח יבצע הזמנה של אחד המוצרים שלך המוצר יופיע ברשימת המוצרים שהוזמנו ממך, אם ברצונך לשלוח את המוצר עליך ללחוץ על הכפתור לאשר שליחה.
                                        </p>

                                    </div>

                                    <div className="faq">
                                        <h3>שאלות נפוצות</h3>
                                        <div className="aq">
                                            <div className="q" onClick={() => { openCloseAnswer(0); }}>
                                                <span className="icon-v">
                                                    {answersSeller[0] ? <i className="fas fa-chevron-up"></i> : <i className="fas fa-chevron-down"></i>}
                                                </span>
                                                <p className="question">
                                                    איזה רהיטים אני יכול לעלות לאתר?
                                                </p>
                                            </div>
                                            {answersSeller[0] && <div className="a">
                                                <p className="answer">
                                                    האתר שלנו מתמחה בעיקר בארונות, מיטות, שולחנות, ספות וכיסאות. וניתן להעלות פריטים אל קטגוריות אלו בלבד.
                                                </p>
                                            </div>}
                                        </div>

                                        <div className="aq">
                                            <div className="q" onClick={() => { openCloseAnswer(1); }}>
                                                <span className="icon-v">
                                                    {answersSeller[1] ? <i className="fas fa-chevron-up"></i> : <i className="fas fa-chevron-down"></i>}
                                                </span>
                                                <p className="question" >
                                                    כיצד אני מעלה מוצר?
                                                </p>
                                            </div>
                                            {answersSeller[1] && <div className="a">
                                                <p className="answer">
                                                    באיזור האישי תחת הכרטיסיה "מוכר" יש כפתור שדרכו תוכל להוסיף מוצר. שים לב- התמונה של המוצר צריכה להיות שמורה ברשת, ולכן עליך להעלות אותה לפניי לרשת- למשל דרך המייל (לשלוח מייל לעצמך עם התמונה).
                                                </p>
                                            </div>}
                                        </div>

                                        <div className="aq">
                                            <div className="q" onClick={() => { openCloseAnswer(2); }}>
                                                <span className="icon-v">
                                                    {answersSeller[2] ? <i className="fas fa-chevron-up"></i> : <i className="fas fa-chevron-down"></i>}
                                                </span>
                                                <p className="question">
                                                    האם האפשרות להעלות מוצר כרוכה בתשלום?
                                                </p>
                                            </div>
                                            {answersSeller[2] && <div className="a">
                                                <p className="answer">
                                                    מכל מכירה של פריט נלקחת עמלה של 5% מסך הרווח של המוכר, אם לא מכרת- לא ייגבה ממך תשלום כלל.
                                                </p>
                                            </div>}
                                        </div>

                                        <div className="aq">
                                            <div className="q" onClick={() => { openCloseAnswer(3); }}>
                                                <span className="icon-v">
                                                    {answersSeller[3] ? <i className="fas fa-chevron-up"></i> : <i className="fas fa-chevron-down"></i>}
                                                </span>
                                                <p className="question">
                                                    כיצד אדע שהוזמן ממני מוצר?
                                                </p>
                                            </div>
                                            {answersSeller[3] && <div className="a">
                                                <p className="answer">
                                                    תחת איזור אישי{'>'}{'>'}מוכר{'>'}{'>'} המוצרים שהוזמנו ממני, שם תוכל לראות את כל ההזמנות שבוצעו למוצרים שלך. לאחר ששלחת את המוצר- עליך ללחוץ על הכפתור "אשר שליחה" ומייל ישלח אל הלקוח. (שים לב שלאחר שתלחץ אשר שליחה, לא תוכל לראות עוד את פרטי ההזמנה).
                                                </p>
                                            </div>}
                                        </div>

                                        <div className="aq">
                                            <div className="q" onClick={() => { openCloseAnswer(4); }}>
                                                <span className="icon-v">
                                                    {answersSeller[4] ? <i className="fas fa-chevron-up"></i> : <i className="fas fa-chevron-down"></i>}
                                                </span>
                                                <p className="question">
                                                    כיצד אקבל את הכסף המגיע לי ממכירת המוצר?
                                                </p>
                                            </div>
                                            {answersSeller[4] && <div className="a">
                                                <p className="answer">
                                                    כדי להעלות מוצר בתחילה תתבקש להכניס פרטי בנק שאליהם יועבר הכסף המתקבל ממכירת המוצר. אצלינו שמורים הפרטים של כל ההזמנות שהתבצעו, הכסף שהקונה משלם מועבר לחשבון הבנק של חברת furni2h והתשלום יועבר אליכם תוך 3 ימי עסקים.
                                                </p>
                                            </div>}

                                        </div>
                                        <div className="aq">
                                            <div className="q" onClick={() => { openCloseAnswer(5); }}>
                                                <span className="icon-v">
                                                    {answersSeller[5] ? <i className="fas fa-chevron-up"></i> : <i className="fas fa-chevron-down"></i>}
                                                </span>
                                                <p className="question">
                                                    היכן אני רואה את המוצרים שלי?
                                                </p>
                                            </div>
                                            {answersSeller[5] && <div className="a">
                                                <p className="answer">
                                                    תחת האיזור האישי{'>'}{'>'} מוכר{'>'}{'>'} כל המוצרים שלי, תוכל לצפות במוצרים שהעלית לאתר, שים לב- אם התבצעה הזמנה למוצר שלך אז תופיע הערה מתחת המוצר "המוצר אינו זמין יותר לרכישה"
                                                </p>
                                            </div>}
                                        </div>
                                    </div>

                                </div>}

                            {userSide === "client" &&
                                <div>
                                    <div className="text-about">
                                        <p>
                                            כדי להזמין מוצר עליך להיות מחובר לאתר.
                                        </p>
                                        <p>
                                            לאח"כ תוכל לבחור מרשימת המוצרים את המוצר שאתה מעוניין בו ולהוסיף אותו לעגלה,
                                        </p>
                                        <p>
                                            כדי לבצע הזמנה עליך לשלם- לבחירתך ע"י אשראי או ע"י PAYPAL , לאחר ביצוע התשלום המוצר שבחרת יופיע אצל המוכר. ברגע שהמוכר ישלח את המוצר לביתך תישלח לך הודעת מייל שמודיעה על כך.
                                        </p>
                                        <p>
                                            בכל שלב תוכל לראות את סטטוס ההזמנה שלך באיזור האישי תחת "מוצרים בהזמנה".
                                        </p>
                                    </div>

                                    <div className="faq">
                                        <h3>שאלות נפוצות</h3>
                                        <div className="aq" >
                                            <div className="q" onClick={() => { openCloseAnswer(0); }}>
                                                <span className="icon-v">
                                                    {answersSeller[0] ? <i className="fas fa-chevron-up"></i> : <i className="fas fa-chevron-down"></i>}
                                                </span>
                                                <p className="question">
                                                    מה אני צריך לעשות כדי לקנות מוצרים באתר?
                                                </p>
                                            </div>
                                            {answersClient[0] && <div className="a">
                                                <p className="answer">
                                                    עלייך להרשם בקלות, ולהתחיל בקניה---
                                                </p>
                                            </div>}
                                        </div>

                                        <div className="aq">
                                            <div className="q" onClick={() => { openCloseAnswer(1); }}>
                                                <span className="icon-v">
                                                    {answersSeller[1] ? <i className="fas fa-chevron-up"></i> : <i className="fas fa-chevron-down"></i>}
                                                </span>
                                                <p className="question">
                                                    כיצד אדע מה מצב המוצר?
                                                </p>
                                            </div>
                                            {answersClient[1] && <div className="a">
                                                <p className="answer">
                                                    תוכל ליצור קשר עם המוכר לפי הפרטים הרשומים על המוצר, ודרכו לברר פרטים נוספים על המוצר כגון אלה.
                                                </p>
                                            </div>}
                                        </div>

                                        <div className="aq">
                                            <div className="q" onClick={() => { openCloseAnswer(2); }}>
                                                <span className="icon-v">
                                                    {answersSeller[2] ? <i className="fas fa-chevron-up"></i> : <i className="fas fa-chevron-down"></i>}
                                                </span>
                                                <p className="question">
                                                    כיצד אני יכול לשלם על המוצרים?
                                                </p>
                                            </div>
                                            {answersClient[2] && <div className="a">
                                                <p className="answer">
                                                    לבחירתך- תשלום דרך PAYPAL או תשלום דרך כרטיס אשראי.
                                                </p>
                                            </div>}
                                        </div>

                                        <div className="aq">
                                            <div className="q" onClick={() => { openCloseAnswer(3); }}>
                                                <span className="icon-v">
                                                    {answersSeller[3] ? <i className="fas fa-chevron-up"></i> : <i className="fas fa-chevron-down"></i>}
                                                </span>
                                                <p className="question">
                                                    כיצד אדע שהמוכר ראה שהזמנתי ממנו את המוצר?
                                                </p>
                                            </div>
                                            {answersClient[3] && <div className="a">
                                                <p className="answer">
                                                    תקבל מייל לכתובת שדרכה נרשמת לאתר, וכן תוכל לצפות בסטטוס ההזמנה שלך תחת האיזור אישי{'>'}{'>'}לקוח{'>'}{'>'}ההזמנות שלי.
                                                </p>
                                            </div>}
                                        </div>

                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
