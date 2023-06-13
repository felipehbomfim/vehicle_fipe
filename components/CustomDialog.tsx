import React, { useEffect, useState } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import LottieView from 'lottie-react-native';

const CustomDialog = ({ visible, type, text, onCancel, ButtonTitle = "", showCancelButton = false, onAccept = '' }) => {
  const [buttonColor, setButtonColor] = useState('grey');
  const [textColor, setTextColor] = useState('black');
  const [animation, setAnimation] = useState('');

   useEffect(() => {
     loadAnimationAndColor(type);
   }, [type])

    const loadAnimationAndColor = (type) => {
       switch (type) {
         case 'error':
           setButtonColor('#ff6347');
           setTextColor('white');
           setAnimation(require('../assets/lotties/error.json'));
           // Carregue a animação de erro
           break;
         case 'success':
           setButtonColor('#2cda94');
           setTextColor('white');
           setAnimation(require('../assets/lotties/success.json'));
           // Carregue a animação de sucesso
           break;
         case 'info':
          setButtonColor('#0094d9');
          setTextColor('white');
          setAnimation(require('../assets/lotties/info.json'));
          // Carregue a animação de sucesso
          break;
         default:
           setButtonColor('grey');
           setTextColor('black');
           // Não há animação para outros tipos
           break;
       }
   };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onCancel}>
      <View style={styles.container}>
        <View style={styles.dialog}>
          {animation && (
            <LottieView
              source={animation}
              autoPlay
              loop={false}
              style={styles.animation}
            />
          )}
          <Text style={styles.text}>{text}</Text>

          <View style={styles.buttonContainer}>
            {showCancelButton && (
              <TouchableOpacity style={[styles.closeButton, { backgroundColor: 'grey' }]} onPress={onCancel}>
                <Text style={[styles.closeButtonText, { color: textColor }]}>Cancelar</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.closeButton, { backgroundColor: buttonColor }]} onPress={showCancelButton ? onAccept : onCancel}>
              <Text style={[styles.closeButtonText, { color: textColor }]}>{ButtonTitle ? ButtonTitle : "Fechar"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    maxWidth: '80%',
    width: '80%',
  },

  animation: {
    width: 200,
    height: 200,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: 20,
  },

  closeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    alignSelf: 'center',
  },
});

export default CustomDialog;
