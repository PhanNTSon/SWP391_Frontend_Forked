import { useEffect, useState } from "react";
import './ReviewList.css'

import axios from "axios";
function ReviewButtons({ originalReview, gameId, userId }) {

    const [helpfulCount, setHelpfulCount] = useState(originalReview.helpful);
    const [notHelpfulCount, setNotHelpfulCount] = useState(originalReview.notHelpful);
    const [userOption, setUserOption] = useState(null);
    const [isReady, setIsReady] = useState(false);
    const authorId = originalReview.userId;

    useEffect(() => {
        const fetchData = async () => {
            await checkUserOption();
            setIsReady(true);
        };
        fetchData();
    }, []);

    const checkUserOption = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/review/${gameId}/${authorId}/check?userId=${userId}`);
            const result = response.data;
            setUserOption(result === 1 ? 1 : result === -1 ? -1 : 0);
        } catch (error) {
            console.error("Error checking user option:", error);
        }
    };

    const handleClick = async (isHelpful) => {
        // If the user hasn't voted yet
        if (userOption === 0 && isHelpful) {
            setHelpfulCount(helpfulCount + 1);
            setUserOption(1);
            try {
                const response = await axios.patch(`http://localhost:8080/review/${gameId}/${authorId}/helpful`, {
                    userId: userId
                });
                console.log("Response from server:", response.data);
            } catch (error) {
                console.error("Error updating helpful count:", error);
            }
        } else if (userOption === 1 && isHelpful) { // If the user has already voted helpful
            setHelpfulCount(helpfulCount - 1);
            setUserOption(0);
            try {
                const response = await axios.patch(`http://localhost:8080/review/${gameId}/${authorId}/clean-reaction`, {
                    userId: userId
                });
                console.log("Response from server:", response.data);
            } catch (error) {
                console.error("Error updating unhelpful count:", error);
            }
        } else if (userOption === 0 && !isHelpful) { // If the user hasn't voted yet and votes not helpful
            setNotHelpfulCount(notHelpfulCount + 1);
            setUserOption(-1);
            try {
                await axios.patch(`http://localhost:8080/review/${gameId}/${authorId}/not-helpful`, {
                    userId: userId
                });
            } catch (error) {
                console.error("Error updating not helpful count:", error);
            }
        } else if (userOption === -1 && !isHelpful) { // If the user has already voted not helpful
            setNotHelpfulCount(notHelpfulCount - 1);
            setUserOption(0);
            try {
                await axios.patch(`http://localhost:8080/review/${gameId}/${authorId}/clean-reaction`, {
                    userId: userId
                });
            } catch (error) {
                console.error("Error updating unhelpful count:", error);
            }
        }
    }

    if (!isReady) {
        return <div className="spinner"></div>;
    }

    return (
        <div className="review-helpful-buttons">
            <div onClick={() => handleClick(true)} className={userOption === 1 ? 'active' : ''}>
                <p>Yes <span role="img" aria-label="thumbs up" style={{ color: 'green', fontSize: '1.5em' }}>👍</span> {helpfulCount}</p>
            </div>
            <div onClick={() => handleClick(false)} className={userOption === -1 ? 'active' : ''}>
                <p>No <span role="img" aria-label="thumbs down" style={{ color: 'red', fontSize: '1.5em' }}>👎</span> {notHelpfulCount}</p>
            </div>
        </div>
    );
}

export default ReviewButtons