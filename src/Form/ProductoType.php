<?php

namespace App\Form;

use App\Entity\{Producto,GrupoMaterial, Unidad};
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\{TextareaType,SubmitType,ChoiceType,TextType,DateType, HiddenType, NumberType};
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Doctrine\ORM\EntityManagerInterface;

class ProductoType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('id',HiddenType::class,[
                'mapped'=>false,
            ])  
            ->add('codigo',TextType::class, [
                'label' => '* Codigo', 
                'required' => true,
                'attr'=>['class'=>'form-control']
            ])
            ->add('descripcionProducto',TextType::class,[
                'label' => '* Nombre', 
                'attr'=>[
                    'class'=>'form-control'
                ]
            ])
            ->add('cantidadProducto', NumberType::class, [
                'label' => '* Cantidad Producto', 
                'html5' => true,
                'required' => true,
                'attr'=>['class'=>'form-control']
            ])
            ->add('unidadMedida', TextType::class, [
                'label' => '* Unidad Medida', 
                'attr'=>['class'=>'form-control']
            ])
            ->add('medida', TextType::class, [
                'label' => '* Medida', 
                'attr'=>['class'=>'form-control']
            ])
            ->add('estado', ChoiceType ::class, [
                'label' => '* Estado', 
                'choices' => array(
                    'Activo' => 'Activo',
                    'Caducado' => 'Caducado',
                    'Procesando' => 'Procesando'
                ),
                'placeholder' => 'Estado producto',
                'required' => true,
                'attr'=>['class'=>'form-control']
            ])
            ->add('fechaIngreso',  DateType::class, [
                'label' => '* Fecha Ingreso', 
                'widget' => 'single_text',
                
                'required' => true,
                'attr'=>['class'=>'form-control js-datepicker']
            ])
            ->add('fechaCaducidad',  DateType::class, [
                'label' => 'Fecha Caducidad', 
                'widget' => 'single_text',
                
                'required' => false,
                'attr'=>['class'=>'form-control js-datepicker']
            ])
            ->add('procedencia', TextType::class, [
                'label' => '* Procedencia', 
                'required' => true,
                'attr'=>['class'=>'form-control']
            ])
            ->add('observaciones', TextareaType::class, [
                'label' => 'Observaciones', 
                'attr'=>['class'=>'form-control']
            ])
            ->add('idGrupo', EntityType::class, [
                'class' => GrupoMaterial::class,
                'choice_label' => 'nombreGrupoM',
                'placeholder' => 'Seleccione catalogo',     
                'label' => '* Categoria', 
                'attr'=>['class'=>'form-control']
            ])
            ->add('guardar', submitType::class)
            ->add('cancelar', submitType::class)
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Producto::class,
        ]);
    }
}
