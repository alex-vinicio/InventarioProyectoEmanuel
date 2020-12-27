<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Unidad
 *
 * @ORM\Table(name="unidad")
 * @ORM\Entity
 */
class Unidad
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="SEQUENCE")
     * @ORM\SequenceGenerator(sequenceName="unidad_id_seq", allocationSize=1, initialValue=1)
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="nombre_unidad", type="string", length=50, nullable=false)
     */
    private $nombreUnidad;

    /**
     * @var string
     *
     * @ORM\Column(name="responsable_unidad", type="string", length=50, nullable=false)
     */
    private $responsableUnidad;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNombreUnidad(): ?string
    {
        return $this->nombreUnidad;
    }

    public function setNombreUnidad(string $nombreUnidad): self
    {
        $this->nombreUnidad = $nombreUnidad;

        return $this;
    }

    public function getResponsableUnidad(): ?string
    {
        return $this->responsableUnidad;
    }

    public function setResponsableUnidad(string $responsableUnidad): self
    {
        $this->responsableUnidad = $responsableUnidad;

        return $this;
    }


}
