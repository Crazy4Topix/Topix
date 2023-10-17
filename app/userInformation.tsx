import React, { FunctionComponent, useState } from 'react';
import { Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';
import * as yup from 'yup';
import { signUpWithEmail, supabase } from '../lib/supabase';
import { styled } from 'nativewind';
import { Picker } from '@react-native-picker/picker';
import { Formik } from 'formik';
import RNDateTimePicker from '@react-native-community/datetimepicker';

interface OwnProps {}

type Props = OwnProps;

const userInformation: FunctionComponent<Props> = (props) => {
  const validationSchema = yup.object({
    name: yup.string().required('name is required'),
    gender: yup
      .mixed()
      .oneOf(['male', 'female', 'other'] as const)
      .defined(),
    birthday: yup
      .date()
      .required('Birthday is required')
      .max(new Date(), 'Cannot be in the future'),
  });

  const submitForm = async (
    values: { name: string; gender: string; birthday: Date },
    { setErrors }: any
  ) => {
    // TODO: implement session
    // setSession(data.data.session);
    // const { error, status } = await supabase
    //   .from('profiles')
    //   .upsert({
    //     id: data?.data?.user?.id,
    //     full_name: values.name,
    //     birthdate: values.birthday,
    //     gender: values.gender,
    //   })
    //   .select();
    //
    // console.log('Update', status, data?.data?.user, error);
    //
    // if (error !== null) {
    //   console.log('Error creating profile', error);
    // }
  };

  const [showDatePicker, setShowDatePicker] = useState(false);
  const StyledPicker = styled(Picker);

  return (
    <SafeAreaView className={'mx-5 h-full pt-12'}>
      <Formik
        initialValues={{ name: '', gender: 'other', birthday: new Date() }}
        onSubmit={submitForm}
        validationSchema={validationSchema}
      >
        {({ handleChange, setFieldValue, handleBlur, handleSubmit, values, errors, touched }) => (
          <View className={'flex bg-background'}>
            <Text className={'text-lg text-primary-text'}>Full name</Text>
            <TextInput
              className={
                'font-primary-cond w-full rounded-lg border-2 border-primary bg-white px-3 py-2 text-base text-primary-text'
              }
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              placeholder={'Alexander'}
              placeholderTextColor="gray"
              autoComplete={'name'}
            />
            <View className={'flex shrink'}>
              <Text className={'text-lg text-red-600'}>
                {errors.name != null && touched.name === true && errors.name}
              </Text>
            </View>

            <Text className={'text-lg text-primary-text'}>Gender</Text>
            <StyledPicker
              mode="dropdown"
              prompt={'Gender'}
              itemStyle={{ backgroundColor: 'grey' }}
              className={
                'font-primary-cond w-full rounded-lg border-2 border-primary bg-white px-3 py-2 text-base text-primary-text'
              }
              selectedValue={values.gender}
              onValueChange={(itemValue, _) => {
                setFieldValue('gender', itemValue).catch((err: any) => {
                  console.log(err);
                });
              }}
            >
              <Picker.Item value={'male'} label={'Male'}></Picker.Item>
              <Picker.Item value={'female'} label={'Female'}></Picker.Item>
              <Picker.Item value={'other'} label={'Other'}></Picker.Item>
            </StyledPicker>
            <View className={'flex shrink'}>
              <Text className={'text-lg text-red-600'}>
                {errors.gender != null && touched.gender === true && errors.gender}
              </Text>
            </View>

            <Text className={'text-lg text-primary-text'}>Birthday</Text>
            <Pressable
              onPress={() => {
                setShowDatePicker(true);
              }}
            >
              <TextInput
                className={
                  'font-primary-cond w-full rounded-lg border-2 border-primary bg-white px-3 py-2 text-base text-primary-text'
                }
                value={values.birthday.toLocaleDateString('nl-NL')}
                editable={false}
              />
            </Pressable>
            {showDatePicker && (
              <RNDateTimePicker
                onChange={(_, date) => {
                  console.log(date);
                  setShowDatePicker(false);
                  if (date != null) {
                    setFieldValue('birthday', date).catch((err: any) => {
                      console.log(err);
                    });
                  }
                }}
                value={new Date()}
              />
            )}
            <View className={'flex shrink'}>
              <Text className={'text-lg text-red-600'}>
                {errors.birthday != null && touched.birthday === true && errors.birthday}
              </Text>
            </View>

            <Pressable
              onPress={() => {
                handleSubmit();
                console.log('Click');
              }}
              className={'flex h-16 w-32 justify-center rounded-md bg-accent'}
            >
              <Text className={'self-center text-white'}>Submit</Text>
            </Pressable>
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default userInformation;
