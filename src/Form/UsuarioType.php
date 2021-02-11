<?php

namespace App\Form;

use App\Entity\{Usuario,Rol};
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\{PasswordType,TextareaType,SubmitType,ChoiceType,TextType,DateType, HiddenType, NumberType};
use Symfony\Bridge\Doctrine\Form\Type\EntityType;

class UsuarioType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            /* ->add('nombre', TextType::class, [
                'label' => '* Nombre ', 
                'required' => true,
                
                'attr'=>['class'=>'form-control']
            ])
            ->add('usuario',TextType::class, [
                'label' => '* correo', 
                'required' => true,
                
                'attr'=>['class'=>'form-control']
            ])
            ->add('password',PasswordType::class, [
                'label' => '* Contraseña', 
                'required' => true,
                
                'attr'=>['class'=>'form-control']
            ]) */
            
            ->add('guardar', submitType::class,[
                'attr'=>['class'=>'btn btn-primary']
            ])
            ->add('cancelar', submitType::class, [
                'attr'=>['class'=>'btn btn-primary']
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Usuario::class,
        ]);
    }
}
