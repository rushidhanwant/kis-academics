// Add this helper function at the top of the file, outside of the component
export const clipBio = (bio: string, wordLimit: number = 30): string => {
    const words = bio.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return bio;
  };