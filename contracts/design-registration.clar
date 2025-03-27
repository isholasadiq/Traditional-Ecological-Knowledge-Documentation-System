;; Design Registration Contract
;; Documents traditional watercraft construction

;; Define data variables
(define-data-var last-design-id uint u0)

;; Define data maps
(define-map designs
  { design-id: uint }
  {
    name: (string-utf8 100),
    description: (string-utf8 500),
    region: (string-utf8 100),
    owner: principal,
    creation-time: uint
  }
)

;; Register a new design
(define-public (register-design (name (string-utf8 100)) (description (string-utf8 500)) (region (string-utf8 100)))
  (let
    (
      (new-id (+ (var-get last-design-id) u1))
    )
    (map-set designs
      { design-id: new-id }
      {
        name: name,
        description: description,
        region: region,
        owner: tx-sender,
        creation-time: block-height
      }
    )
    (var-set last-design-id new-id)
    (ok new-id)
  )
)

;; Get design details
(define-read-only (get-design (design-id uint))
  (map-get? designs { design-id: design-id })
)

;; Check if a design exists
(define-read-only (design-exists (design-id uint))
  (is-some (map-get? designs { design-id: design-id }))
)

;; Get the total number of designs
(define-read-only (get-design-count)
  (var-get last-design-id)
)
