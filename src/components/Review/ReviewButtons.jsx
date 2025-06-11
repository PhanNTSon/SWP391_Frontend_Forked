import { useState } from "react";
import './ReviewList.css'

import axios from "axios";
function ReviewButtons({ gameId, originalReview }) {
    
    const [helpfulCount, setHelpfulCount] = useState(originalReview.helpful)
    const [notHelpfulCount, setNotHelpfulCount] = useState(originalReview.notHelpful)
    const userId = originalReview.userId;
    const [isClicked, setIsClicked] = useState(false)

    const handleClick = async (isHelpful) => {
        if (isClicked) return;

        const newHelpful = isHelpful ? helpfulCount + 1 : helpfulCount;
        const newNotHelpful = isHelpful ? notHelpfulCount : notHelpfulCount + 1;

        setHelpfulCount(newHelpful);
        setNotHelpfulCount(newNotHelpful);
        setIsClicked(true);

        try {
            
            await axios.put(`http://localhost:8080/review/${gameId}/update-review`, {
                userId: userId,
                helpful: newHelpful,
                notHelpful: newNotHelpful,
                recommended: originalReview.recommended,
                reviewContent: originalReview.reviewContent
            });
        } catch (err) {
            console.error("Error Patching ", err);
        }
    }


    return (
        <>
            <div className="review-helpful-buttons">
                <div onClick={() => handleClick(true)}>
                    <p>Yes <span role="img" aria-label="thumbs up" style={{ color: 'green', fontSize: '1.5em' }}>👍</span> {helpfulCount}</p>
                </div>
                <div onClick={() => handleClick(false)}>
                    <p>No <span role="img" aria-label="thumbs down" style={{ color: 'red', fontSize: '1.5em' }}>👎</span> {notHelpfulCount}</p>
                </div>
            </div>
        </>
    )
}

export default ReviewButtons