const initialLocationX = Math.floor(500 * Math.random() + 10);
const initialLocationY = Math.floor(500 * Math.random() + 10);

const playerSpeed = 10;

function draw(canvasCtx, setPlayerLocation) {
    setPlayerLocation({initialLocationX, initialLocationY});

    canvasCtx.beginPath();
    canvasCtx.fillStyle = "rgb(255, 0, 0)";
    canvasCtx.arc(initialLocationX, initialLocationY, 10, 0, Math.PI * 2);
    canvasCtx.fill();
    canvasCtx.lineWidth = 3;
    canvasCtx.strokeStyle = "rgb(0, 255, 0)";
    canvasCtx.stroke();

    requestAnimationFrame(() => draw(canvasCtx));
}


// function handleMouseMove(canvasElement, player, modifyLocationX, modifyLocationY) {
//     const canvasWidth = canvasElement.width;
//     const canvasHeight = canvasElement.height;
//
//     let vectorX, vectorY;
//
//     canvasElement.addEventListener("mousemove", (event) => {
//         const {clientX: x, clientY: y} = event;
//
//         const angleDegree = Math.atan2(y - (canvasWidth / 2), x - (canvasHeight / 2)) * 180 / Math.PI;
//
//         if (angleDegree >= 0 && angleDegree < 90) {
//             vectorX = 1 - (angleDegree / 90);
//             vectorY = -(angleDegree / 90);
//         } else if (angleDegree >= 90 && angleDegree <= 180) {
//             vectorX = -(angleDegree - 90) / 90;
//             vectorY = -(1 - ((angleDegree - 90) / 90));
//         } else if (angleDegree >= -180 && angleDegree < -90) {
//             vectorX = (angleDegree + 90) / 90;
//             vectorY = (1 + ((angleDegree + 90) / 90));
//         } else if (angleDegree < 0 && angleDegree >= -90) {
//             vectorX = (angleDegree + 90) / 90;
//             vectorY = (1 - ((angleDegree + 90) / 90));
//         }
//
//         if ((player.locationX < 5 && vectorX < 0) || (player.locationX > 500) && (vectorX > 0)) {
//             modifyLocationY({sign: "-", locationY: playerSpeed * vectorY});
//         } else if ((player.locationY < 5 && vectorY > 0) || (player.locationY > 500) && (vectorY < 0)) {
//             modifyLocationX({sign: "+", locationX: playerSpeed * vectorX});
//         } else {
//             modifyLocationX({sign: "+", locationX: playerSpeed * vectorX});
//             modifyLocationY({sign: "-", locationY: playerSpeed * vectorY});
//         }
//     });
// }

export {draw, handleMouseMove};
