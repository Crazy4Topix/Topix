import React, { type FunctionComponent } from 'react';
import { Fade, Placeholder, PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';
import { View } from 'react-native';
import { styled } from 'nativewind';

const NewsThumbnailSkeleton: FunctionComponent = () => {
  const PlaceholderStyled = styled(Placeholder);
  const PlaceholderLineStyled = styled(PlaceholderLine);
  const PlaceholderMediaStyled = styled(PlaceholderMedia);

  return (
    <View className={'m-2'}>
      <PlaceholderStyled Animation={Fade}>
        <PlaceholderMediaStyled className={'h-32 w-32 rounded-lg'} />
        <PlaceholderLineStyled className={'mt-2 w-32'} />
        <PlaceholderLineStyled width={40} className={'-mt-2'} />
      </PlaceholderStyled>
    </View>
  );
};

export default NewsThumbnailSkeleton;
