export const animate = (
  scrollTo: (args: {
    offset: number;
    animated: boolean;
    nofix?: boolean;
  }) => void,
  isLooped: boolean,
  currentPage: number,
  childrenLength: number,
  childWidth: number,
) => {
  let offset = 0;
  // if page number is bigger then length - something is incorrect
  if (currentPage >= childrenLength) {
    throw new Error(
      `currentPage ${currentPage} >= childrenLength ${childrenLength}`,
    );
  }
  if (currentPage === 0 && isLooped) {
    // in "looped" scenario first page shold be placed after the last one
    offset = childrenLength * childWidth;
  } else {
    offset = currentPage * childWidth;
  }

  scrollTo({ offset, animated: false });
  //
  if (currentPage === 0) {
    if (isLooped) {
      // animate properly based on direction
      if (currentPage !== childrenLength - 1) {
        scrollTo({
          offset: (childrenLength + 2) * childWidth,
          animated: false,
          nofix: true,
        });
      }
      scrollTo({ offset: childrenLength * childWidth, animated: true });
    } else {
      scrollTo({ offset: 0, animated: true });
    }
  } else if (currentPage === 1) {
    // To properly animate from the first page we need to move view
    // to its original position first (not needed if not looped)
    if (currentPage === 0 && isLooped) {
      scrollTo({ offset: 0, animated: false, nofix: true });
    }
    scrollTo({ offset: childWidth, animated: true });
  } else {
    // Last page is allowed to jump to the first through the "border"
    if (currentPage === 0 && currentPage !== childrenLength - 1) {
      scrollTo({ offset: 0, animated: false, nofix: true });
    }
    scrollTo({ offset: currentPage * childWidth, animated: true });
  }
};
