import React, { type FunctionComponent, useContext } from 'react';
import { Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';
import * as yup from 'yup';
import { supabase } from '../lib/supabase';
import { Formik } from 'formik';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { SupabaseUser } from '../contexts/supabase_user';
import { useNavigation } from 'expo-router';
import { SupabaseUserSession } from '../contexts/user_session';

const userInformation: FunctionComponent = () => {
  const { user } = useContext(SupabaseUser);
  const { session } = useContext(SupabaseUserSession);

  const navigation = useNavigation();

  const validationSchema = yup.object({
    name: yup.string().required('name is required'),
    birthday: yup
      .date()
      .required('Birthday is required')
      .max(new Date(), 'Cannot be in the future'),
  });

  const submitForm = async (values: { name: string; birthday: Date }) => {
    const { error, status } = await supabase
      .from('profiles')
      .upsert({
        id: user?.id,
        full_name: values.name,
        birthdate: values.birthday,
      })
      .select();

    console.log('Update', status, user, error);

    if (error !== null) {
      console.log('Error creating profile', error, user, session);
      return;
    }

    // @ts-expect-error It complains about never but it is there
    navigation.navigate('topicSelection');
  };

  return (
    <SafeAreaView className={'h-full w-full bg-white px-5 pt-12'}>
      <Formik
        initialValues={{ name: '', birthday: new Date() }}
        onSubmit={submitForm}
        validationSchema={validationSchema}
      >
        {({ handleChange, setFieldValue, handleBlur, handleSubmit, values, errors, touched }) => (
          <View className={'flex'}>
            <Text className={'text-lg text-primary-text'}>Full name</Text>
            <TextInput
              className={
                'font-Poppins_regular w-full rounded-lg border-2 border-primary bg-white px-3 py-2 text-base text-primary-text'
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

            <Text className={'text-lg text-primary-text'}>Birthday</Text>
            <Pressable
              onPress={() => {
                // setShowDatePicker(true);
                DateTimePickerAndroid.open({
                  value: values.birthday,
                  onChange: (event, date) => {
                    if (date != null && event.type !== 'dismissed') {
                      setFieldValue('birthday', date).catch((err: any) => {
                        console.log(err);
                      });
                    }
                  },
                });
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
            <View className={'flex shrink'}>
              <Text className={'text-lg text-red-600'}>
                {/* {errors.birthday != null && touched.birthday === true && String(errors.birthday)} */}
              </Text>
            </View>

            <Pressable
              onPress={() => {
                handleSubmit();
                console.log('Click');
              }}
              className={'flex h-16 w-32 justify-center rounded-md bg-accent'}
            >
              <Text className={'self-center text-white'}>Next</Text>
            </Pressable>
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default userInformation;
