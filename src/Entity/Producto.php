<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Producto
 *
 * @ORM\Table(name="producto", indexes={@ORM\Index(name="idx_a7bb06151d34fa6b", columns={"id_unidad_id"}), @ORM\Index(name="idx_a7bb0615cc58dc96", columns={"id_grupo_id"})})
 * @ORM\Entity
 */
class Producto
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="SEQUENCE")
     * @ORM\SequenceGenerator(sequenceName="producto_id_seq", allocationSize=1, initialValue=1)
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="codigo", type="string", length=50, nullable=false)
     */
    private $codigo;

    /**
     * @var string
     *
     * @ORM\Column(name="descripcion_producto", type="string", length=150, nullable=true)
     */
    private $descripcionProducto;

    /**
     * @var float
     *
     * @ORM\Column(name="cantidad_producto", type="float", precision=10, scale=0, nullable=false)
     */
    private $cantidadProducto;

    /**
     * @var string
     *
     * @ORM\Column(name="unidad_medida", type="string", length=20, nullable=false)
     */
    private $unidadMedida;

    /**
     * @var string
     *
     * @ORM\Column(name="medida", type="string", length=20, nullable=false)
     */
    private $medida;

    /**
     * @var string
     *
     * @ORM\Column(name="estado", type="string", length=20, nullable=false)
     */
    private $estado;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="fecha_ingreso", type="datetime", nullable=false)
     */
    private $fechaIngreso;

    /**
     * @var \DateTime|null
     *
     * @ORM\Column(name="fecha_caducidad", type="datetime", nullable=true)
     */
    private $fechaCaducidad;


    /**
     * @var string
     *
     * @ORM\Column(name="procedencia", type="string", length=100, nullable=false)
     */
    private $procedencia;

    /**
     * @var string
     *
     * @ORM\Column(name="observaciones", type="string", length=200, nullable=true)
     */
    private $observaciones;

    /**
     * @var float
     *
     * @ORM\Column(name="tiempo_entre_gestion", type="float", precision=10, scale=0, nullable=true)
     */
    private $tiempoEntreGestion;

    /**
     * @var \Unidad
     *
     * @ORM\ManyToOne(targetEntity="Unidad")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_unidad_id", referencedColumnName="id")
     * })
     */
    private $idUnidad;

    /**
     * @var \GrupoMaterial
     *
     * @ORM\ManyToOne(targetEntity="GrupoMaterial")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_grupo_id", referencedColumnName="id")
     * })
     */
    private $idGrupo;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCodigo(): ?string
    {
        return $this->codigo;
    }

    public function setCodigo(string $codigo): self
    {
        $this->codigo = $codigo;

        return $this;
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

    public function getCantidadProducto(): ?float
    {
        return $this->cantidadProducto;
    }

    public function setCantidadProducto(float $cantidadProducto): self
    {
        $this->cantidadProducto = $cantidadProducto;

        return $this;
    }

    public function getUnidadMedida(): ?string
    {
        return $this->unidadMedida;
    }

    public function setUnidadMedida(string $unidadMedida): self
    {
        $this->unidadMedida = $unidadMedida;

        return $this;
    }

    public function getMedida(): ?string
    {
        return $this->medida;
    }

    public function setMedida(string $medida): self
    {
        $this->medida = $medida;

        return $this;
    }

    public function getEstado(): ?string
    {
        return $this->estado;
    }

    public function setEstado(string $estado): self
    {
        $this->estado = $estado;

        return $this;
    }

    public function getFechaIngreso(): ?\DateTimeInterface
    {
        return $this->fechaIngreso;
    }

    public function setFechaIngreso(\DateTimeInterface $fechaIngreso): self
    {
        $this->fechaIngreso = $fechaIngreso;

        return $this;
    }

    public function getFechaCaducidad(): ?\DateTimeInterface
    {
        return $this->fechaCaducidad;
    }

    public function setFechaCaducidad(?\DateTimeInterface $fechaCaducidad): self
    {
        $this->fechaCaducidad = $fechaCaducidad;

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

    public function getObservaciones(): ?string
    {
        return $this->observaciones;
    }

    public function setObservaciones(string $observaciones): self
    {
        $this->observaciones = $observaciones;

        return $this;
    }

    public function getTiempoEntreGestion(): ?float
    {
        return $this->tiempoEntreGestion;
    }

    public function setTiempoEntreGestion(float $tiempoEntreGestion): self
    {
        $this->tiempoEntreGestion = $tiempoEntreGestion;

        return $this;
    }

    public function getIdUnidad(): ?Unidad
    {
        return $this->idUnidad;
    }

    public function setIdUnidad(?Unidad $idUnidad): self
    {
        $this->idUnidad = $idUnidad;

        return $this;
    }

    public function getIdGrupo(): ?GrupoMaterial
    {
        return $this->idGrupo;
    }

    public function setIdGrupo(?GrupoMaterial $idGrupo): self
    {
        $this->idGrupo = $idGrupo;

        return $this;
    }


}
