import React, { useContext, useState } from 'react';
import { Pressable, TextInput, View, Text, SafeAreaView } from 'react-native';
import { SupabaseUserSession } from '../contexts/user_session';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Picker } from '@react-native-picker/picker';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { signUpWithEmail, supabase } from '../lib/supabase';
import { styled } from 'nativewind';

export default function Signup() {
  const { setSession } = useContext(SupabaseUserSession);

  const validationSchema = yup.object({
    name: yup.string().required('name is required'),
    gender: yup
      .mixed()
      .oneOf(['male', 'female', 'other'] as const)
      .defined(),
    birthday: yup.date().required('Birthday is required'),
    // .max(new Date(), 'Cannot be in the future'),
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup.string().required('Password is required'),
  });

  const submitForm = async (
    values: { name: string; gender: string; birthday: Date; email: string; password: string },
    { setErrors }: any
  ) => {
    const data = await signUpWithEmail(values.email, values.password);

    if (data?.error != null) {
      setSession(null);
      setErrors({ password: data.error.message });
      return;
    }

    if (data?.data === null) {
      console.log('No data found?');
      return;
    }

    setSession(data.data.session);

    const { error, status } = await supabase
      .from('profiles')
      .upsert({
        id: data?.data?.user?.id,
        full_name: values.name,
        birthday: values.birthday,
        gender: values.gender,
      })
      .select();

    console.log('Update', status, data?.data?.user, error);

    if (error !== null) {
      console.log('Error creating profile', error);
    }
  };

  const [showDatePicker, setShowDatePicker] = useState(false);
  const StyledPicker = styled(Picker);

  return (
    <SafeAreaView className={'mx-5 h-full pt-12'}>
      <Formik
        initialValues={{ email: '', password: '', name: '', gender: 'Other', birthday: new Date() }}
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
                {errors.gender != null && touched.gender === true && errors.gender}
              </Text>
            </View>

            <Text className={'text-lg text-primary-text'}>Email</Text>
            <TextInput
              className={
                'font-primary-cond w-full rounded-lg border-2 border-primary bg-white px-3 py-2 text-base text-primary-text'
              }
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              placeholder={'alexander@pom.show'}
              placeholderTextColor="gray"
              autoComplete={'email'}
              keyboardType={'email-address'}
            />
            <View className={'flex shrink'}>
              <Text className={'text-lg text-red-600'}>
                {errors.email != null && touched.email === true && errors.email}
              </Text>
            </View>

            <Text className={'font-primary-cond-bold  text-lg text-primary-text'}>Password</Text>
            <TextInput
              className={
                'font-primary-cond w-full rounded-lg border-2 border-primary bg-white px-3 py-2 text-base text-black'
              }
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              secureTextEntry={true}
              placeholder={'Al3xand3r!'}
              textContentType={'password'}
              passwordRules={
                'minlength: 8; required: lower; required: upper; required: digit; required: [-];'
              }
              placeholderTextColor="gray"
            />
            <View className={'flex shrink'}>
              <Text className={'text-lg text-red-600'}>
                {errors.password != null && touched.password === true && errors.password}
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
}
