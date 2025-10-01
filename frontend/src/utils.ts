export const setNewOffset = (card: HTMLDivElement, mouseMoveDir = { x: 0, y: 0 }) => {
    const offsetLeft = card.offsetLeft - mouseMoveDir.x;
    const offsetTop = card.offsetTop - mouseMoveDir.y;

    return {
        x: offsetLeft < 0 ? 0 : offsetLeft,
        y: offsetTop < 0 ? 0 : offsetTop,
    }
}

export const autoGrow = (textAreaRef: React.RefObject<HTMLTextAreaElement> ) => {
    const {current} = textAreaRef
    // Make sure current is not null
    if (current) {
        current.style.height = "auto";
        current.style.height = `${current.scrollHeight}px`; // Use template literal for better readability
    }
}

export const setZIndex = (selectedCard: HTMLDivElement) => {
    selectedCard.style.zIndex = "999";

    Array.from(document.getElementsByClassName("card")).forEach((card) => {
        const htmlCard = card as HTMLDivElement; // Cast to HTMLDivElement
        if (htmlCard !== selectedCard) {
            htmlCard.style.zIndex = `${parseInt(selectedCard.style.zIndex) - 1}`;
        }
    });
};