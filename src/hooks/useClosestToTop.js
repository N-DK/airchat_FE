import { useState, useEffect } from 'react';

function useClosestToTop(refs, rootMargin = '0px') {
    const [activeIndex, setActiveIndex] = useState(null); // Chỉ số của phần tử gần đỉnh nhất

    useEffect(() => {
        if (!refs || refs.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                // Tìm phần tử gần đỉnh của khung hình nhất
                const visibleEntries = entries
                    .filter((entry) => entry.intersectionRatio > 0) // Chỉ giữ lại các phần tử visible
                    .sort(
                        (a, b) =>
                            a.boundingClientRect.top - b.boundingClientRect.top,
                    ); // Sắp xếp dựa trên khoảng cách từ đỉnh của phần tử tới đỉnh khung hình
                if (visibleEntries.length > 0) {
                    // Chọn phần tử có đỉnh gần nhất với top của viewport
                    const closest = visibleEntries[0];
                    const index = refs.findIndex(
                        (ref) => ref.current === closest.target,
                    );
                } else {
                    setActiveIndex(null);
                }
            },
            {
                rootMargin,
                threshold: [0],
            },
        );

        // Quan sát tất cả các refs hiện tại
        refs.forEach((ref) => {
            if (ref.current) observer.observe(ref.current);
        });

        // Dọn dẹp khi component bị unmount
        return () => {
            refs.forEach((ref) => {
                if (ref.current) observer.unobserve(ref.current);
            });
        };
    }, [refs, rootMargin]);

    return activeIndex;
}

export default useClosestToTop;
