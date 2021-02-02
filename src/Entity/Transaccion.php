<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Transaccion
 *
 * @ORM\Table(name="transaccion", indexes={@ORM\Index(name="idx_bff96af795b31ab5", columns={"codigo_producto_id"}), @ORM\Index(name="idx_bff96af77eb2c349", columns={"id_usuario_id"})})
 * @ORM\Entity
 */
class Transaccion
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="SEQUENCE")
     * @ORM\SequenceGenerator(sequenceName="transaccion_id_seq", allocationSize=1, initialValue=1)
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="descripcion_producto", type="string", length=150, nullable=false)
     */
    private $descripcionProducto;

    /**
     * @var string
     *
     * @ORM\Column(name="responsable", type="string", length=50, nullable=false)
     */
    private $responsable;

    /**
     * @var string
     *
     * @ORM\Column(name="entrada_producto", type="string", length=150, nullable=false)
     */
    private $entradaProducto;

    /**
     * @var string
     *
     * @ORM\Column(name="salida_producto", type="string", length=150, nullable=false)
     */
    private $salidaProducto;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="fecha_operacion", type="datetime", nullable=false)
     */
    private $fechaOperacion;

    /**
     * @var \DateTime|null
     *
     * @ORM\Column(name="fecha_caducidad", type="datetime", nullable=true)
     */
    private $fechaCaducidad;

     /**
     * @var string|null
     *
     * @ORM\Column(name="marca", type="string", length=20, nullable=true)
     */
    private $marca;

    /**
     * @var string|null
     *
     * @ORM\Column(name="color", type="string", length=20, nullable=true)
     */
    private $color;

    /**
     * @var string|null
     *
     * @ORM\Column(name="procedencia", type="string", length=50, nullable=true)
     */
    private $procedencia;

    /**
     * @var \Usuario
     *
     * @ORM\ManyToOne(targetEntity="Usuario")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_usuario_id", referencedColumnName="id")
     * })
     */
    private $idUsuario;

    /**
     * @var \Producto
     *
     * @ORM\ManyToOne(targetEntity="Producto")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="codigo_producto_id", referencedColumnName="id")
     * })
     */
    private $codigoProducto;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDescripcionProducto(): ?string
    {
        return $this->descripcionProducto;
    }

    public function setDescripcionProducto(string $descripcionProducto): self
    {
        $this->descripcionProducto = $descripcionProducto;

        return $this;
    }

    public function getResponsable(): ?string
    {
        return $this->responsable;
    }

    public function setResponsable(string $responsable): self
    {
        $this->responsable = $responsable;

        return $this;
    }

    public function getEntradaProducto(): ?string
    {
        return $this->entradaProducto;
    }

    public function setEntradaProducto(string $entradaProducto): self
    {
        $this->entradaProducto = $entradaProducto;

        return $this;
    }

    public function getSalidaProducto(): ?string
    {
        return $this->salidaProducto;
    }

    public function setSalidaProducto(string $salidaProducto): self
    {
        $this->salidaProducto = $salidaProducto;

        return $this;
    }

    public function getFechaOperacion(): ?\DateTimeInterface
    {
        return $this->fechaOperacion;
    }

    public function setFechaOperacion(\DateTimeInterface $fechaOperacion): self
    {
        $this->fechaOperacion = $fechaOperacion;

        return $this;
    }

    public function getFechaCaducidad(): ?\DateTimeInterface
    {
        return $this->fechaCaducidad;
    }

    public function getMarca(): ?string
    {
        return $this->marca;
    }

    public function setMarca(string $marca): self
    {
        $this->marca = $marca;

        return $this;
    }

    public function getColor(): ?string
    {
        return $this->color;
    }

    public function setColor(string $color): self
    {
        $this->color = $color;

        return $this;
    }

    public function getProcedencia(): ?string
    {
        return $this->procedencia;
    }

    public function setProcedencia(string $procedencia): self
    {
        $this->procedencia = $procedencia;

        return $this;
    }

    public function setFechaCaducidad(?\DateTimeInterface $fechaCaducidad): self
    {
        $this->fechaCaducidad = $fechaCaducidad;

        return $this;
    }

    public function getIdUsuario(): ?Usuario
    {
        return $this->idUsuario;
    }

    public function setIdUsuario(?Usuario $idUsuario): self
    {
        $this->idUsuario = $idUsuario;

        return $this;
    }

    public function getCodigoProducto(): ?Producto
    {
        return $this->codigoProducto;
    }

    public function setCodigoProducto(?Producto $codigoProducto): self
    {
        $this->codigoProducto = $codigoProducto;

        return $this;
    }


}
