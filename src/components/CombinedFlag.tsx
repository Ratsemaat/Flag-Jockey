import React, { useEffect,  useState } from 'react';

interface CombinedFlagProps {
  selectedCountries: string[];
}

const CombinedFlag: React.FC<CombinedFlagProps> = ({ selectedCountries }) => {
  const [combinedFlagUrl, setCombinedFlagUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Function to calculate average pixel values
  const calculateAveragePixels = async (imageUrls: string[]): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        // Create a canvas to work with
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Set canvas size (standard flag ratio 3:2)
        const width = 300;
        const height = 200;
        canvas.width = width;
        canvas.height = height;

        // Load all images
        const images: HTMLImageElement[] = [];
        let loadedCount = 0;

        if (imageUrls.length === 0) {
          reject(new Error('No images to process'));
          return;
        }

        const loadImage = (url: string, index: number) => {
          const img = new Image();
          img.crossOrigin = 'Anonymous';
          img.onload = () => {
            images[index] = img;
            loadedCount++;
            
            // When all images are loaded, process them
            if (loadedCount === imageUrls.length) {
              try {
                // Initialize an array to store sum of pixel values
                const pixelSums = new Uint32Array(width * height * 4);
                
                // Process each image
                images.forEach(img => {
                  // Draw image on canvas
                  ctx.clearRect(0, 0, width, height);
                  ctx.drawImage(img, 0, 0, width, height);
                  
                  // Get image data
                  const imageData = ctx.getImageData(0, 0, width, height);
                  const data = imageData.data;
                  
                  // Add pixel values to sums
                  for (let i = 0; i < data.length; i++) {
                    pixelSums[i] += data[i];
                  }
                });
                
                // Calculate averages
                const avgData = new Uint8ClampedArray(width * height * 4);
                const divisor = images.length;
                
                for (let i = 0; i < pixelSums.length; i++) {
                  avgData[i] = Math.round(pixelSums[i] / divisor);
                }
                
                // Create new image data with averaged pixels
                const avgImageData = new ImageData(avgData, width, height);
                
                // Put averaged image data back on canvas
                ctx.putImageData(avgImageData, 0, 0);
                
                // Convert canvas to data URL
                resolve(canvas.toDataURL());
              } catch (err) {
                reject(err);
              }
            }
          };
          
          img.onerror = () => {
            // Skip failed images
            loadedCount++;
            if (loadedCount === imageUrls.length && images.length > 0) {
              // Process whatever images we could load
              try {
                // Initialize an array to store sum of pixel values
                const pixelSums = new Uint32Array(width * height * 4);
                
                // Process each successfully loaded image
                images.forEach(img => {
                  // Draw image on canvas
                  ctx.clearRect(0, 0, width, height);
                  ctx.drawImage(img, 0, 0, width, height);
                  
                  // Get image data
                  const imageData = ctx.getImageData(0, 0, width, height);
                  const data = imageData.data;
                  
                  // Add pixel values to sums
                  for (let i = 0; i < data.length; i++) {
                    pixelSums[i] += data[i];
                  }
                });
                
                // Calculate averages
                const avgData = new Uint8ClampedArray(width * height * 4);
                const divisor = images.length;
                
                for (let i = 0; i < pixelSums.length; i++) {
                  avgData[i] = Math.round(pixelSums[i] / divisor);
                }
                
                // Create new image data with averaged pixels
                const avgImageData = new ImageData(avgData, width, height);
                
                // Put averaged image data back on canvas
                ctx.putImageData(avgImageData, 0, 0);
                
                // Convert canvas to data URL
                resolve(canvas.toDataURL());
              } catch (err) {
                reject(err);
              }
            } else if (loadedCount === imageUrls.length && images.length === 0) {
              reject(new Error('All images failed to load'));
            }
          };
          
          img.src = url;
        };

        // Start loading all images
        imageUrls.forEach((url, index) => {
          loadImage(url, index);
        });
      } catch (err) {
        reject(err);
      }
    });
  };

  // Effect to update combined flag when selected countries change
  useEffect(() => {
    if (selectedCountries.length === 0) {
      setCombinedFlagUrl('');
      return;
    }

    setLoading(true);
    setError('');

    // Generate URLs for selected country flags
    const flagUrls = selectedCountries.map(code =>
      new URL(`../assets/flags/${code}.svg`, import.meta.url).href
    );

    calculateAveragePixels(flagUrls)
      .then(url => {
        setCombinedFlagUrl(url);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error calculating average pixels:', err);
        setError('Failed to generate combined flag');
        setLoading(false);
      });
  }, [selectedCountries]);

  // If no countries are selected, show the default message
  if (selectedCountries.length === 0) {
    return (
      <div className="combined-flag-container">
        <h2>Combined Flag</h2>
        <div className="blended-flag">
          <div className="blended-flag-content">
            No flags select for mixing
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="combined-flag-container">
        <h2>Combined Flag</h2>
        <div className="blended-flag">
          <div className="blended-flag-content">
            Generating combined flag...
          </div>
        </div>
        <p className="flag-description">Processing {selectedCountries.length} countries</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="combined-flag-container">
        <h2>Combined Flag</h2>
        <div className="blended-flag">
          <div className="blended-flag-content">
            Error: {error}
          </div>
        </div>
        <p className="flag-description">Failed to generate combined flag</p>
      </div>
    );
  }

  // Show the combined flag
  return (
    <div className="combined-flag-container">
      <h3>Combined Flag</h3>
      {combinedFlagUrl ? (
        <img
          src={combinedFlagUrl}
          alt="Combined Flag"
          className="combined-flag"
        />
      ) : (
        <div className="blended-flag">
          <div className="blended-flag-content">
            No combined flag available
          </div>
        </div>
      )}
      <p className="flag-description">{selectedCountries.length} countries selected</p>
    </div>
  );
};

export default CombinedFlag;